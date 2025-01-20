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

export function createOneMail(mail: string, boxes: string[]) {
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
