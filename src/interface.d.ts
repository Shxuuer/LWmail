export interface mail {
  addNewMail: (mail: {}) => boolean;
  onMailsUpdate: (callback: (mails: []) => void) => void;
}

declare global {
  interface Window {
    mail: mail;
  }
}
