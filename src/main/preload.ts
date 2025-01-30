import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("mail", {
  openHowToAdd: () => ipcRenderer.send("open-how-to-add"),
  addAccount: (account: Account) =>
    ipcRenderer.sendSync("add-account", account),
  delAccount: (accountAddr: string) =>
    ipcRenderer.sendSync("del-account", accountAddr),
  getHtmlByUid: (accountAddr: string, boxPath: string, uid: string) =>
    ipcRenderer.sendSync("get-html-by-uid", accountAddr, boxPath, uid),
  onMailsUpdate: (callback: (accountBox: AccountBox[]) => void) =>
    ipcRenderer.on("update-mails", (event, accountBox) => callback(accountBox)),
});
