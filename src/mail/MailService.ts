const Imap = require('imap');
const readline = require('readline');
const iconv = require('iconv-lite');

class MailService {
  private host: string;
  private port: string;
  private user: string;
  private password: string;
  private imap: any;

  constructor(host: string, port: string, user: string, password: string) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.connect();
  }

  private async connect() {
    this.imap = new Imap({
      user: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      tls: true,
    });

    this.imap.once('end', () => {
      console.log('Connection ended');
    });

    this.imap.once('error', (err: any) => {
      console.log(err);
    });

    this.imap.connect();
  }

  public getMailBoxes() {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.getBoxes((err: any, boxes: any) => {
          if (err) reject(err);
          resolve(boxes);
        });
      });
    });
  }

  public async getMailBox(boxName: string) {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.openBox(boxName, true, (err: any, box: any) => {
          if (err) reject(err);
          resolve(box);
        });
      });
    });
    // this.imap.once('ready', () => {
    //   this.imap.openBox(boxName, true, (err: any, box: any) => {
    //     if (err) throw err;
    //     const f = this.imap.seq.fetch('1:3', {
    //       bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
    //       struct: true,
    //     });
    //     f.on('message', (msg: any) => {
    //       msg.on('body', (stream: any, info: any) => {
    //         let buffer = '';
    //         stream.on('data', (chunk: any) => {
    //           buffer += chunk.toString('utf8');
    //         });
    //         stream.once('end', () => {
    //           console.log(Imap.parseHeader(buffer));
    //         });
    //       });
    //     });
    //     f.once('error', (err: any) => {
    //       console.log('Fetch error: ' + err);
    //     });
    //     f.once('end', () => {
    //       console.log('Done fetching all messages!');
    //       this.imap.end();
    //     });
    //   });
    // });
  }
}

export { MailService };
