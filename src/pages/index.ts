function createMailBox(boxName: string) {
  const mailBox = document.createElement('div');
  mailBox.className = 'mail-box';
  const mailBoxName = document.createElement('div');
  mailBoxName.className = 'mail-box-name';
  mailBoxName.innerText = boxName;
  const mails = document.createElement('div');
  mails.className = 'mails';
  mailBox.appendChild(mailBoxName);
  mailBox.appendChild(mails);
  return mailBox;
}

function createMailBoxes(boxes: string[]) {
  const mailBoxes = document.createElement('div');
  mailBoxes.className = 'mail-boxes';
  boxes.forEach((boxName) => {
    mailBoxes.appendChild(createMailBox(boxName));
  });
  return mailBoxes;
}

function createOneMail(mail: string, boxes: string[]) {
  const oneMail = document.createElement('div');
  oneMail.className = 'one-mail';
  const mailAddr = document.createElement('div');
  mailAddr.className = 'mail-addr';
  const img = document.createElement('img');
  img.src = '../../static/off.svg';
  const span = document.createElement('span');
  span.innerText = mail;
  mailAddr.appendChild(img);
  mailAddr.appendChild(span);
  oneMail.appendChild(mailAddr);
  oneMail.appendChild(createMailBoxes(boxes));
  return oneMail;
}

function createPop(inner: HTMLElement) {
  const body = document.body;
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.appendChild(inner);
  body.appendChild(pop);
}

const leftBar = document.getElementById('left-bar');
const inner = createOneMail('shenxu@bupt.edu.cn', ['收件箱']);
leftBar?.appendChild(inner);

document.getElementsByClassName('add-mail')[0].addEventListener('click', () => {
  const inputPop = document.createElement('div');
  inputPop.className = 'input-pop';
  const title = document.createElement('div');
  title.className = 'input-pop-title';
  title.innerText = '添加邮箱';
  inputPop.appendChild(title);
  const inputArea = document.createElement('div');
  inputArea.className = 'input-pop-area';
  inputPop.appendChild(inputArea);

  function createInput(info: {
    label: string;
    id: string;
    password?: boolean;
  }) {
    const container = document.createElement('div');
    container.className = 'input-pop-container';
    const labelElement = document.createElement('label');
    labelElement.innerText = info.label;
    labelElement.className = 'input-pop-label';
    const inputElement = document.createElement('input');
    inputElement.type = info.password ? 'password' : 'text';
    inputElement.id = info.id;
    inputElement.className = 'input-pop-input';
    container.appendChild(labelElement);
    container.appendChild(inputElement);
    return container;
  }
  const infos = [
    { label: 'imap服务器', id: 'imap' },
    { label: 'imap端口号', id: 'imap-port' },
    { label: 'smtp服务器', id: 'smtp' },
    { label: 'smtp端口号', id: 'smtp-port' },
    { label: '邮箱地址', id: 'mail-addr' },
    { label: '密码', id: 'password', password: true },
  ];
  infos.forEach((info) => {
    inputArea.appendChild(createInput(info));
  });

  const confirm = document.createElement('button');
  confirm.innerText = '确定';
  confirm.className = 'input-pop-confirm';
  inputPop.appendChild(confirm);
  confirm.addEventListener('click', () => {
    const inputs = document.getElementsByClassName('input-pop-input');
    const mail = {
      imap: (inputs[0] as HTMLInputElement).value,
      imapPort: (inputs[1] as HTMLInputElement).value,
      smtp: (inputs[2] as HTMLInputElement).value,
      smtpPort: (inputs[3] as HTMLInputElement).value,
      mailAddr: (inputs[4] as HTMLInputElement).value,
      password: (inputs[5] as HTMLInputElement).value,
    };
    window.mail.safeStorageMailInfo(mail);
  });
  createPop(inputPop);
});
