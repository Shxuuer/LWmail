export interface mail {
  addNewMail: (mail: {}) => boolean;
  delMail: (mail: string) => boolean;
  onMailsUpdate: (callback: (mails: []) => void) => void;
  openHowToAdd: () => void;
}

declare global {
  interface Window {
    mail: mail;
  }
}

declare global {
  interface Message {
    subject: string;
    date: Date;
    from: { name: string; address: string };
    to: { name: string; address: string };
    source: string;
  }
  interface Box {
    boxName: string;
    messages: Message[];
  }
  interface Account {
    imap: string;
    imapPort: string;
    smtp: string;
    smtpPort: string;
    mailAddr: string;
    password: string;
    accessToken?: string;
  }
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
