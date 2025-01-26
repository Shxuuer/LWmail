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
  interface MailInfo {
    subject: string;
    date: Date;
    from: { name: string; address: string };
    to: { name: string; address: string };
    source: string;
  }
}

declare global {
  interface Boxes {
    boxName: string;
    messages: MailInfo[];
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
