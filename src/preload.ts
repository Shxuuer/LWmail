const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mail', {
  safeStorageMailInfo: (mail: {}) =>
    ipcRenderer.send('safe-storage-mail-info', mail),
});
