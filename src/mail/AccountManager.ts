import { MailService } from "./MailService";
import { updateMailsToRenderer } from "../main/ipc";
import * as path from "path";
import fs from "fs";
import { safeStorage } from "electron";

export class AccountManager {
  // registered accounts list
  private accounts: MailService[] = [];
  // path to store account information
  private readonly configPath = path.join(__dirname, "../../config/mails");

  constructor() {
    // create config path if not exists
    if (!fs.existsSync(this.configPath))
      fs.mkdirSync(this.configPath, { recursive: true });
    // get all accounts from database and regist them
    this.getAccountsListFromDatabase().forEach((accountAddr) => {
      const account: Account = this.getAccountFromDatabase(accountAddr);
      this.registAccount(account).then((service: MailService) => {});
    });
  }

  /**
   * get all registed accounts
   * @returns {MailService[]} accounts
   */
  public getAccounts(): MailService[] {
    return this.accounts;
  }

  /**
   * check if the account is valid
   * @param {Account} account account information
   * @returns {Promise<boolean>} is valid
   */
  public checkAccount(account: Account): Promise<boolean> {
    return new Promise((resolve, reject) => {
      new MailService(account, true)
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
   * register an account
   * @param {Account} account account information
   * @returns {Promise<MailService>} when registered resolve or reject
   */
  public async registAccount(account: Account): Promise<MailService> {
    return new Promise((resolve, reject) => {
      const index = this.accounts.findIndex(
        (acc) => acc.mailAddr === account.mailAddr,
      );
      if (index !== -1) return;
      const client = new MailService(account);
      client
        .connect()
        .then(() => {
          this.accounts.push(client);
          updateMailsToRenderer();
          resolve(client);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  /**
   * unregister an account
   * @param {string} accountAddr account address
   */
  public unregistAccount(accountAddr: string): void {
    const index = this.accounts.findIndex(
      (account) => account.mailAddr === accountAddr,
    );
    if (index === -1) return;
    this.accounts.splice(index, 1);
    this.accounts[index].close();
    updateMailsToRenderer();
  }

  /**
   * get accounts list from database, just email address
   * @returns {string[]} accounts
   */
  public getAccountsListFromDatabase(): string[] {
    return fs.readdirSync(this.configPath);
  }

  /**
   * get account from database
   * @param accountAddr account address you want to get
   * @returns {Account} account information
   */
  public getAccountFromDatabase(accountAddr: string): Account {
    const encrypted = fs.readFileSync(path.join(this.configPath, accountAddr));
    return JSON.parse(safeStorage.decryptString(encrypted));
  }

  /**
   * add account to database
   * @param account account information
   */
  public addAccountToDatabase(account: Account): void {
    let buffer: Buffer = safeStorage.encryptString(JSON.stringify(account));
    fs.writeFileSync(path.join(this.configPath, account.mailAddr), buffer);
  }

  /**
   * delete account from database
   * @param accountAddr account address
   */
  public delAccountFromDatabase(accountAddr: string): void {
    if (!fs.existsSync(path.join(this.configPath, accountAddr))) return;
    fs.unlinkSync(path.join(this.configPath, accountAddr));
  }

  public checkNewMails(): void {}
}
