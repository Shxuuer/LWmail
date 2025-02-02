import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("mail", {
  openBrowser: (url: string) => ipcRenderer.send("open-browser", url),
  addAccount: (account: Account) =>
    ipcRenderer.sendSync("add-account", account),
  delAccount: (accountAddr: string) =>
    ipcRenderer.send("del-account", accountAddr),
  getHtmlByUid: (accountAddr: string, boxPath: string, uid: string) =>
    ipcRenderer.sendSync("get-html-by-uid", accountAddr, boxPath, uid),
  onMailsUpdate: (callback: (accountBox: AccountBox[]) => void) =>
    ipcRenderer.on("update-mails", (event, accountBox) => callback(accountBox)),
});
