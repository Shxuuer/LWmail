import { MailService } from "../mail/MailService";
import { updateMailsToRenderer } from "../main/ipc";
import * as path from "path";
import fs from "fs";
import { safeStorage } from "electron";

export interface Mail {
  imap: string;
  imapPort: string;
  smtp: string;
  smtpPort: string;
  mailAddr: string;
  password: string;
  accessToken?: string;
  client?: MailService;
}

const mails: Mail[] = [];
const configPath = path.join(__dirname, "../config/mails");

/**
 * get registered mails list
 * @returns Mail[] registered mails
 */
export function getMails(): Mail[] {
  return mails;
}

/**
 * register a new mail
 * @param mail Mail mail to be registered
 */
export async function addMail(mail: Mail) {
  const client = new MailService(mail);
  await client
    .connect()
    .then(() => {
      mail.client = client;
      mails.push(mail);
      updateMailsToRenderer();
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * remove a mail from registered mails
 * @param mailAddr string mail address to be removed
 */
export function removeMail(mailArr: string) {
  const index = mails.findIndex((mail) => mail.mailAddr === mailArr);
  if (index !== -1) {
    mails[index].client?.close();
    mails.splice(index, 1);
    delMailFromDisk(mailArr);
    updateMailsToRenderer();
  }
}

/**
 * read mail list from disk
 * @returns string[] mail list
 */
function readMailListFromDisk(): string[] {
  return fs.readdirSync(configPath);
}

/**
 * read mails from disk
 * @returns Mail[] mails read from disk
 */
function readMailsFromDisk(): Mail[] {
  const list = readMailListFromDisk();
  return list.map((mailAddr) => {
    return JSON.parse(
      safeStorage.decryptString(
        fs.readFileSync(path.join(configPath, mailAddr))
      )
    );
  });
}

/**
 * write mail into disk
 * @param mail Mail mail to be written into disk
 */
export function writeMailIntoDisk(mail: Mail): void {
  let buffer: Buffer = safeStorage.encryptString(JSON.stringify(mail));
  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath, { recursive: true });
  fs.writeFileSync(path.join(configPath, mail.mailAddr), buffer);
}

function delMailFromDisk(mail: string): void {
  if (!fs.existsSync(path.join(configPath, mail))) return;
  fs.unlinkSync(path.join(configPath, mail));
}

/**
 * check mail connection
 * @param mail Mail mail to be checked
 * @returns Promise<boolean> connection status
 */
export async function checkMail(mail: Mail): Promise<boolean> {
  return new Promise((resolve, reject) => {
    new MailService(mail)
      .connect()
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * start mail manager
 */
export function startMailManager(): void {
  if (!fs.existsSync(configPath)) fs.mkdirSync(configPath, { recursive: true });

  mails.forEach((mail) => mail.client?.close());
  mails.splice(0, mails.length);

  readMailsFromDisk().forEach((item) => {
    addMail(item);
  });
}
