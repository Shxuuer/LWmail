import { app } from 'electron';
import { createWindow, createTray } from './main/ui';
import { handleIPC } from './main/ipc';
import { startMailManager } from './mail/mailManager';

app.whenReady().then(() => {
  createTray();
  createWindow();
  handleIPC();
  startMailManager();
});

app.on('window-all-closed', () => {});
