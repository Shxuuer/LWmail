import { app } from "electron";
import { createWindow, createTray } from "./main/ui";
import { handleIPC } from "./main/ipc";
import { AccountManager } from "./mail/AccountManager";

export let accountManager: AccountManager | null = null;

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.whenReady().then(() => {
  createTray();
  createWindow();
  const accountManager: AccountManager = new AccountManager();
  handleIPC(accountManager);
});

app.on("window-all-closed", () => {});
