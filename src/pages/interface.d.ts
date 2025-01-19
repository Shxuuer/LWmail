export interface mail {
  getMailBoxes: () => Promise<any>;
}

declare global {
  interface Window {
    mail: mail;
  }
}
