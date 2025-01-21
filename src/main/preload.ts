import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mail', {
  addNewMail: (mail: {}) => ipcRenderer.sendSync('add-new-mail', mail),
  onMailsUpdate: (callback: (mails: []) => void) =>
    ipcRenderer.on('update-mails', (event, mails) => callback(mails)),
});
