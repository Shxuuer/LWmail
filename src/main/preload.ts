const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mail', {
  addNewMail: (mail: {}) => ipcRenderer.sendSync('add-new-mail', mail),
});
