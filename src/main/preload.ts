import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mail', {
  openHowToAdd: () => ipcRenderer.send('open-how-to-add'),
  addNewMail: (mail: {}) => ipcRenderer.sendSync('add-new-mail', mail),
  delMail: (mail: string) => ipcRenderer.send('del-mail', mail),
  onMailsUpdate: (callback: (mails: []) => void) =>
    ipcRenderer.on('update-mails', (event, mails) => callback(mails)),
});
