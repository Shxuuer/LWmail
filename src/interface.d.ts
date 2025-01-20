export interface mail {
  safeStorageMailInfo: (mail: {}) => Promise<any>;
}

declare global {
  interface Window {
    mail: mail;
  }
}
