import { ImapFlow, ListResponse } from 'imapflow';

class MailService {
  private host: string;
  private port: string;
  private user: string;
  private password: string;
  private accessToken: string | undefined;
  private verifyOnly: boolean = false;
  private client: ImapFlow | null = null;

  constructor(
    info: {
      imap: string;
      imapPort: string;
      smtp: string;
      smtpPort: string;
      mailAddr: string;
      password: string;
      accessToken?: string;
    },
    verifyOnly: boolean = false,
  ) {
    this.host = info.imap;
    this.port = info.imapPort;
    this.user = info.mailAddr;
    this.password = info.password;
    this.accessToken = info.accessToken;
    this.verifyOnly = verifyOnly;
  }

  public async connect() {
    this.client = new ImapFlow({
      host: this.host,
      port: Number(this.port),
      secure: true,
      logger: false,
      verifyOnly: this.verifyOnly,
      auth: {
        user: this.user,
        pass: this.password,
        accessToken: this.accessToken,
      },
      connectionTimeout: 10000,
    });
    return this.client.connect();
  }

  public async close() {
    return this.client?.close();
  }

  public async getBoxes(): Promise<ListResponse[]> {
    if (!this.client?.authenticated) await this.connect();
    const boxes = await this.client?.list()!;
    return boxes;
  }

  public async getMails(box: string): Promise<any> {
    if (!this.client?.authenticated) await this.connect();
    let mailbox = await this.client?.mailboxOpen('INBOX');
    const msgs: any[] = [];
    for await (let msg of this.client?.fetch('1:*', {
      source: true,
      envelope: true,
    })!) {
      msgs.push(msg);
    }
    return msgs;
  }
}

export { MailService };
