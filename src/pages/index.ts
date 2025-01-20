// export interface Mail {
//   mailAddr: string;
//   open: boolean;
//   boxes: Box[];
// }
// export interface Box {
//   boxName: string;
//   open: boolean;
//   mails: [];
// }
// export interface MailState {}
// const mails: Mail[] = [
//   {
//     mailAddr: 'shenxu@bupt.edu.cn',
//     open: false,
//     boxes: [
//       {
//         boxName: '收件箱',
//         open: false,
//         mails: [],
//       },
//     ],
//   },
//   {
//     mailAddr: 'shxuuer@outlook.com',
//     open: false,
//     boxes: [
//       {
//         boxName: '收件箱',
//         open: false,
//         mails: [],
//       },
//     ],
//   },
// ];
import { createOneMail } from './components';
const leftBar = document.getElementById('left-bar');
leftBar?.appendChild(createOneMail('shenxu@bupt.edu.cn', ['收件箱']));
