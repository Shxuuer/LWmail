import { MailService } from './MailService';

interface User {
  host: string;
  port: string;
  user: string;
  password: string;
}

const users: User[] = [];

export const mailServices: MailService[] = users.map(
  (user) => new MailService(user.host, user.port, user.user, user.password),
);
