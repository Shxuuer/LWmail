import { ipcMain } from 'electron';
import {
  writeMailIntoDisk,
  checkMail,
  addMail,
  getMails,
  Mail,
} from '../mail/mailManager';
import { mainWindow } from './ui';

/**
 * Handle IPC messages
 */
export function handleIPC(): void {
  ipcMain.on('add-new-mail', async (event, mail) => {
    await checkMail(mail)
      .then((res) => {
        writeMailIntoDisk(mail);
        addMail(mail);
        event.returnValue = res;
      })
      .catch((err) => {
        console.log(err);
        event.returnValue = false;
      });
  });
}

/**
 * send message to renderer, **you need to use this method whenever you change mails list**
 */
export function updateMailsToRenderer(): void {
  const info = getMails().map((mail: Mail) => {
    return {
      mailAddr: mail.mailAddr,
    };
  });
  mainWindow?.webContents.send('update-mails', info);
}
