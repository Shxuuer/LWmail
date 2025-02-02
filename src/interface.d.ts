export interface mail {
  addAccount: (account: Account) => boolean | string;
  delAccount: (accountAddr: string) => void;
  getHtmlByUid: (accountAddr: string, boxPath: string, uid: string) => string;
  onMailsUpdate: (callback: (accountBox: AccountBox[]) => void) => void;
  openBrowser: (url: string) => void;
}

declare global {
  interface Window {
    mail: mail;
  }
}

declare global {
  type Account = {
    imap: string;
    imapPort: string;
    smtp: string;
    smtpPort: string;
    mailAddr: string;
    password: string;
    accessToken?: string;
  };
  type AccountBox = {
    accountAddr: string;
    boxes: Box[];
  };
  type Box = {
    boxPath: string;
    messages: Message[];
  };
  type Message = {
    subject?: string;
    date?: Date;
    from?: { name: string; address: string };
    to?: { name: string; address: string };
    source?: string;
    sourcePlain?: string;
    uid: string;
  };
}

declare global {
  module "*.svg";
  module "*.png";
  module "*.png";
  module "*.jpg";
  module "*.jpeg";
  module "*.gif";
  module "*.bmp";
  module "*.tiff";
}
