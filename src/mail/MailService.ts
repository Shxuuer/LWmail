import { ImapFlow, ListResponse, FetchMessageObject } from "imapflow";
import { simpleParser } from "mailparser";
import DOMPurify from "isomorphic-dompurify";

class MailService {
  // account information
  public imap: string;
  public imapPort: string;
  public smtp: string;
  public smtpPort: string;
  public mailAddr: string;
  public password: string;
  public accessToken?: string;

  // just for check account information is valid or not
  private verifyOnly: boolean = false;
  // imap client
  private client: ImapFlow = null;

  // caches
  private boxCache: Box[] = [];

  constructor(info: Account, verifyOnly: boolean = false) {
    this.imap = info.imap;
    this.imapPort = info.imapPort;
    this.smtp = info.smtp;
    this.smtpPort = info.smtpPort;
    this.mailAddr = info.mailAddr;
    this.password = info.password;
    this.accessToken = info.accessToken;
    this.verifyOnly = verifyOnly;
  }

  /**
   * connect to the mail server
   * @returns {Promise<void>} when connected resolve or reject
   */
  public async connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.client = new ImapFlow({
        host: this.imap,
        port: Number(this.imapPort),
        secure: true,
        logger: false,
        verifyOnly: this.verifyOnly,
        auth: {
          user: this.mailAddr,
          pass: this.password,
          accessToken: this.accessToken,
        },
        connectionTimeout: 10000,
      })!;
      await this.client.connect();
      if (!this.verifyOnly) await this.initCache();
      resolve();
    });
  }

  /**
   * close the connection
   * @returns {Promise<void>} when closed resolve or reject
   */
  public async close(): Promise<void> {
    return this.client?.close();
  }

  /**
   * get all boxes of account
   * @returns {Promise<string[]>} boxes' path
   */
  public async getBoxesPath(): Promise<string[]> {
    if (!this.client?.authenticated) await this.connect();
    const boxes = await this.client?.list()!;
    return boxes.map((box) => box.path);
  }

  /**
   * get mails' uid from box
   * @param {string} boxPath box path you want to get mails
   * @param {number | string} quantity quantity of mails you want to get
   * @returns {Promise<string[]>} mails' uid.
   */
  public async getBoxMailUID(
    boxPath: string,
    quantity: number | string
  ): Promise<string[]> {
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const ids: FetchMessageObject[] = await this.client?.fetchAll(
      `1:${quantity}`,
      { uid: true }
    );
    lock?.release();
    const uid: string[] = ids.map((id) => id.uid.toString());
    return uid.reverse();
  }

  /**
   * get mails' envelopes from box
   * @param {string} boxPath box path you want to get mails
   * @param {number | string} quantity quantity of mails you want to get
   * @returns {Promise<FetchMessageObject[]>} mails' envelopes.
   */
  public async getBoxMailEnvelopes(
    boxPath: string,
    quantity: number | string
  ): Promise<FetchMessageObject[]> {
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const envelopes = await this.client?.fetchAll(`1:${quantity}`, {
      envelope: true,
    });
    lock?.release();
    return envelopes.reverse();
  }

  /**
   * get mail's envelope by uid
   * @param {string} boxPath box path you want to get mails
   * @param {number | string} uid mail's uid you want to get
   * @returns {Promise<FetchMessageObject>} mails' envelope.
   */
  public async getMailEnvelops(
    boxPath: string,
    uid: number | string
  ): Promise<FetchMessageObject> {
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const envelope = await this?.client.fetchOne(
      `${uid}`,
      { envelope: true },
      { uid: true }
    );
    lock?.release();
    return envelope;
  }

  /**
   * get mail's html (mails' content) from box. To make everything safe, DOMPurify is used to sanitize the html.
   * @param {string} boxPath box path you want to get mail
   * @param {number | string} uid mail's uid you want to get
   * @returns {Promise<string>} putified email content.
   */
  public async getMailHTML(
    boxPath: string,
    uid: number | string
  ): Promise<string> {
    // if cached, return source
    let caches = this.boxCache.find((box) => box.boxPath === boxPath);
    let cached = caches.messages.find((msg) => msg.uid === `${uid}`);
    if (cached?.source) return cached.source;
    // if not cached, download and parse
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const binary = await this.client?.download(`${uid}`, undefined, {
      uid: true,
    });
    const parsed = await simpleParser(binary.content);
    lock?.release();
    const html = DOMPurify.sanitize(parsed.html || parsed.textAsHtml);
    // add to cache
    caches.messages.find((msg) => msg.uid === `${uid}`).source = html;
    return html;
  }

  /**
   * get box caches
   * @returns caches
   */
  public getCache(): Box[] {
    return this.boxCache;
  }

  /**
   * fetch message object to message
   * @param {FetchMessageObject} envelope message object
   * @returns {Message} message
   */
  public static FetchMessage2Message(envelope: FetchMessageObject): Message {
    return {
      subject: envelope.envelope.subject,
      date: envelope.envelope.date,
      from: {
        name: envelope.envelope.from[0].name,
        address: envelope.envelope.from[0].address,
      },
      to: {
        name: envelope.envelope.to[0].name,
        address: envelope.envelope.to[0].address,
      },
      uid: envelope.uid.toString(),
    };
  }

  /**
   * check new mails
   * @param {string[]} boxesPath boxes path you want to check
   * @returns {Promise<Message[]>} new mails
   */
  public async checkNewMails(boxesPath: string[]): Promise<Message[]> {
    return new Promise(async (resolve, reject) => {
      const newMails: Message[] = [];
      const boxPromise: Promise<void>[] = boxesPath.map(async (boxPath) => {
        let caches: Box = this.boxCache.find((box) => box.boxPath === boxPath);
        const cachesMsgsUID: string[] = caches.messages.map((msg) => msg.uid);
        const newMsgsUID: string[] = await this.getBoxMailUID(boxPath, "*");
        const uidPromise: Promise<void>[] = newMsgsUID.map(async (uid) => {
          if (!cachesMsgsUID.includes(uid)) {
            // find new mail
            const envelope = await this.getMailEnvelops(boxPath, uid);
            const newMail: Message = MailService.FetchMessage2Message(envelope);
            caches.messages.push(newMail);
            newMails.push(newMail);
          }
        });
        await Promise.all(uidPromise);
      });
      await Promise.all(boxPromise);
      resolve(newMails);
    });
  }

  /**
   * init cache
   * @returns {Promise<void>} when inited resolve or reject
   */
  private async initCache(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const boxesPath = await this.getBoxesPath();
      // add box to cache
      this.boxCache.push(
        ...boxesPath.map((boxPath) => ({ boxPath, messages: [] as Message[] }))
      );
      // get all mails from boxes
      const boxPromise: Promise<void>[] = boxesPath.map(async (boxPath) => {
        let caches = this.boxCache.find((box) => box.boxPath === boxPath);
        const envelopes = await this.getBoxMailEnvelopes(boxPath, "*");
        caches.messages = envelopes.map((envelope) =>
          MailService.FetchMessage2Message(envelope)
        );
      });
      await Promise.all(boxPromise);
      resolve();
    });
  }

  /**
   * get all mails from box
   * @param {string} boxPath box path you want to get mails
   * @returns {Promise<any>} mails
   * @deprecated to slow to get all mails at once, use getBoxMailEnvelope and getMailHTML instead.
   */
  public async getMails(boxPath: string): Promise<any> {
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const msgs: any[] = [];
    for await (let msg of this.client?.fetch("1:*", {
      source: true,
      envelope: true,
    })!) {
      const parsed = await simpleParser(msg.source);
      msgs.push({ source: parsed, envelope: msg.envelope });
    }
    lock?.release();
    return msgs.reverse();
  }
}

export { MailService };
