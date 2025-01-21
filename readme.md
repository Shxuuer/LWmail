# LWmail

LWmail: A concise email client.
**Everything is in the initial stage**

## Why do we want to make LWmail?

The number of emails in everyone's hands is increasing, and they all come from different email providers. The demand for unified management and real-time reminders is growing. At the same time, most email clients on the market have stopped maintenance or have redundant functions, and there is an urgent need for a clear and centralized email client with clear pages.

## How to add a new email user?

### open the IMAP and SMTP services

For different email providers, IMAP and SMTP services are generally opened in the "Settings" option. Carefully read the prompts of the email provider and follow the requirements to operate.

Due to the different security protocols of different email providers, please refer to the email providers listed below for instructions. If you cannot find your email provider, please follow their guidance. We sincerely hope that you can provide your operation guide through Github PR.

#### QQ邮箱及腾讯企业邮

在设置中打开IMAP和SMTP服务，无需配置Token。

#### 163

在设置中打开IMAP和SMTP服务，并且保存好登录Token（**该凭证只会显示一次，务必保存好**），将代码填入至登录时的Token中。

#### outlook

you should config OAuth2 service, guide is coming...

### Fill in information

Fill in the server and port numbers (and Token, if required) for IMAP and SMTP into the input box, and click "OK"

## build

```bash
yarn install
npm run buildjs
```
