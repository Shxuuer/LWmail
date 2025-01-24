import { ipcMain } from 'electron';
import {
  writeMailIntoDisk,
  checkMail,
  addMail,
  removeMail,
  getMails,
  Mail,
} from '../mail/mailManager';
import { mainWindow } from './ui';
import { shell } from 'electron';

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
        if (err.response) {
          err = 'from server: ' + err.response;
        }
        event.returnValue = err;
      });
  });
  ipcMain.on('del-mail', (event, mail) => {
    removeMail(mail);
  });
  ipcMain.on('open-how-to-add', () => {
    shell.openExternal(
      'https://github.com/Shxuuer/LWmail/blob/master/doc/add-new-account.md',
    );
  });
}

/**
 * send message to renderer, **you need to use this method whenever you change mails list**
 */
export function updateMailsToRenderer(): void {
  const info = getMails().map(async (mail: Mail) => {
    const boxList = await mail.client?.getBoxes();
    const boxes: Promise<Boxes>[] = boxList?.map(async (box) => {
      const messages = await mail.client?.getMails(box.path);
      return {
        boxName: box.name,
        messages: messages?.map(
          (msg: {
            envelope: { subject: any; date: any; from: any[]; to: any[] };
            source: any;
          }) => {
            return {
              subject: msg.envelope.subject,
              date: msg.envelope.date,
              from: msg.envelope.from[0],
              to: msg.envelope.to[0],
              source: msg.source.html,
            };
          },
        ) as MailInfo[],
      };
    })!;
    return {
      mailAddr: mail.mailAddr,
      boxes: await Promise.all(boxes),
    };
  });
  Promise.all(info).then((info) => {
    mainWindow?.webContents.send('update-mails', info);
  });
}
