const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mail', {
  getMailBoxes: () => ipcRenderer.invoke('get-mail-boxes'),
  getMailBox: (boxName: string) => ipcRenderer.invoke('get-mail-box', boxName),
});
