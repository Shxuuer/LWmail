import { ipcMain } from 'electron';
import { writeMailIntoDisk, checkMail } from '../mail/mailManager';

export function handleIPC() {
  ipcMain.on('add-new-mail', async (event, mail) => {
    await checkMail(mail)
      .then((res) => {
        writeMailIntoDisk(mail);
        event.returnValue = res;
      })
      .catch((err) => {
        event.returnValue = false;
      });
  });
}
