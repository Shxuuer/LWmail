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
