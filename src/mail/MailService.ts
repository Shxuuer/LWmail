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
    return this.client.connect();
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
   * @returns {Promise<ListResponse[]>} boxes
   */
  public async getBoxes(): Promise<ListResponse[]> {
    if (!this.client?.authenticated) await this.connect();
    const boxes = await this.client?.list()!;
    return boxes;
  }

  /**
   * get mails' uid from box
   * @param {string} boxPath box path you want to get mails
   * @param {number} quantity quantity of mails you want to get
   * @returns {Promise<FetchMessageObject[]>} mails' uid.
   */
  public async getBoxMailUID(
    boxPath: string,
    quantity: number,
  ): Promise<FetchMessageObject[]> {
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const ids = await this.client?.fetchAll(`1:${quantity}`, { uid: true });
    lock?.release();
    return ids.reverse();
  }

  /**
   * get mails' envelope from box
   * @param {string} boxPath box path you want to get mails
   * @param {number} quantity quantity of mails you want to get
   * @returns {Promise<FetchMessageObject[]>} mails' envelope.
   */
  public async getBoxMailEnvelope(
    boxPath: string,
    quantity: number,
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
   * get mail's html (mails' content) from box. To make everything safe, DOMPurify is used to sanitize the html.
   * @param {string} boxPath box path you want to get mail
   * @param {number} uid mail's uid you want to get
   * @returns {Promise<string>} putified email content.
   */
  public async getMailHTML(boxPath: string, uid: number): Promise<string> {
    if (!this.client?.authenticated) await this.connect();
    let lock = await this.client?.getMailboxLock(boxPath);
    const binary = await this.client?.download(`${uid}`, undefined, {
      uid: true,
    });
    const parsed = await simpleParser(binary.content);
    lock?.release();
    const html = DOMPurify.sanitize(parsed.html || parsed.textAsHtml);
    return html;
  }

  /**
   * @description to slow to get all mails at once, use getBoxMailEnvelope, getMailHTML instead.
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
