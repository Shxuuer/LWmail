export interface mail {
  addNewMail: (mail: {}) => Promise<any>;
}

declare global {
  interface Window {
    mail: mail;
  }
}
