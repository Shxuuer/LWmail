import { ipcMain, shell, IpcMainEvent } from "electron";
import { AccountManager } from "../mail/AccountManager";
import { mainWindow } from "./ui";

/**
 * Handle IPC messages
 */
export function handleIPC(accountManager: AccountManager): void {
  ipcMain.on("add-account", (event, account) =>
    addAccount(event, account, accountManager),
  );
  ipcMain.on("del-account", (event, accountAddr) =>
    delAccount(event, accountAddr, accountManager),
  );
  ipcMain.on("open-browser", (event, url) => openBrowser(url));
  ipcMain.on("get-html-by-uid", (event, accountAddr, boxPath, uid) =>
    getHtmlByUid(event, accountAddr, boxPath, uid, accountManager),
  );
}

/**
 * add new account to database and service
 * @param event IpcMainEvent event
 * @param account type Account
 * @param accountManager accountManager given by handleIPC
 */
async function addAccount(
  event: IpcMainEvent,
  account: Account,
  accountManager: AccountManager,
): Promise<void> {
  accountManager
    .checkAccount(account)
    .then((res) => {
      accountManager.addAccountToDatabase(account);
      accountManager.registAccount(account);
      event.returnValue = res;
    })
    .catch((err) => {
      if (err.response) err = "from server: " + err.response;
      event.returnValue = err;
    });
}

/**
 * remove account from database and service
 * @param event IpcMainEvent event
 * @param accountAddr address of account you want to remove
 * @param accountManager accountManager given by handleIPC
 */
async function delAccount(
  event: IpcMainEvent,
  accountAddr: string,
  accountManager: AccountManager,
): Promise<void> {
  accountManager.unregistAccount(accountAddr);
  accountManager.delAccountFromDatabase(accountAddr);
}

/**
 * get mail's html source by account address, box path and uid of mail
 * @param event IpcMainEvent event
 * @param accountAddr address of account
 * @param boxPath box path of mail
 * @param uid uid of mail
 * @param accountManager accountManager given by handleIPC
 */
async function getHtmlByUid(
  event: IpcMainEvent,
  accountAddr: string,
  boxPath: string,
  uid: string,
  accountManager: AccountManager,
) {
  const html = await accountManager.getMailHTML(accountAddr, boxPath, uid);
  event.returnValue = html;
}

/**
 * open browser
 * @param url url you want to open
 */
function openBrowser(url: string): void {
  shell.openExternal(url);
}

/**
 * send message to renderer, **you need to use this method whenever you change mails list**
 */
export function updateMailsToRenderer(accountManager: AccountManager): void {
  mainWindow?.webContents.send("update-mails", accountManager.getBoxList());
}
