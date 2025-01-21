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
    });
    return this.client.connect();
  }

  public async getMailBoxes(): Promise<ListResponse[] | undefined> {
    return this.client?.list();
  }

  public async getMailBox(boxName: string) {}
}

export { MailService };
