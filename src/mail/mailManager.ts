import { MailService } from '../mail/MailService';
import * as path from 'path';
import fs from 'fs';
import { safeStorage } from 'electron';

interface Mail {
  imap: string;
  imapPort: string;
  smtp: string;
  smtpPort: string;
  mailAddr: string;
  password: string;
  client?: MailService;
}

const mails: Mail[] = [];

export function getMails() {
  return mails;
}

export async function addMail(mail: Mail) {
  const client = new MailService(mail);
  client
    .connect()
    .then(() => {
      mail.client = client;
      mails.push(mail);
    })
    .catch((err) => {
      console.log(err);
    });
}

function readMailListFromDisk() {
  return fs.readdirSync(path.join(__dirname, '../config/mails'));
}

function readMailsFromDisk(): Mail[] {
  const list = readMailListFromDisk();
  return list.map((mailAddr) => {
    return JSON.parse(
      safeStorage.decryptString(
        fs.readFileSync(path.join(__dirname, '../config/mails', mailAddr)),
      ),
    );
  });
}

export function writeMailIntoDisk(mail: Mail) {
  let buffer: Buffer = safeStorage.encryptString(JSON.stringify(mail));
  if (!fs.existsSync(path.join(__dirname, '../config/mails', mail.mailAddr))) {
    fs.mkdirSync(path.join(__dirname, '../config/mails'));
  }
  fs.writeFileSync(
    path.join(__dirname, '../config/mails', mail.mailAddr),
    buffer,
  );
}

export async function checkMail(mail: Mail) {
  return new Promise((resolve, reject) => {
    new MailService(mail)
      .connect()
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        reject(false);
      });
  });
}

export function startMailManager() {
  readMailsFromDisk().forEach((item) => {
    addMail(item);
  });
}
