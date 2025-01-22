let selectedMail: string | boolean = false;

/**
 * create a mail box
 * @param boxName box name
 * @returns HTMLElement mail box
 */
function createMailBox(boxName: string) {
  const mailBox = document.createElement('div');
  mailBox.className = 'mail-box';
  const mailBoxName = document.createElement('span');
  mailBoxName.className = 'mail-box-name';
  mailBoxName.innerText = boxName;
  mailBoxName.addEventListener('click', () => {
    const accounts = document.getElementById(
      'left-bar-accounts',
    ) as HTMLElement;
    const mails = document.getElementById('left-bar-mails') as HTMLElement;
    accounts.style.transform = 'translateX(-100%)';
    mails.style.transform = 'translateX(-100%)';
  });
  mailBox.appendChild(mailBoxName);
  return mailBox;
}

/**
 * create mail boxes
 * @param boxes box names
 * @returns HTMLElement mail boxes
 */
function createMailBoxes(boxes: string[]) {
  const mailBoxes = document.createElement('div');
  mailBoxes.className = 'mail-boxes';
  boxes.forEach((boxName) => {
    mailBoxes.appendChild(createMailBox(boxName));
  });
  return mailBoxes;
}

/**
 * create one mail element
 * @param mail mail address
 * @param boxes mail boxes
 * @param mailId mail id
 * @returns HTMLElement mail element
 */
function createOneMail(mail: string, boxes: string[]) {
  const oneMail = document.createElement('div');
  oneMail.className = 'one-mail';
  const mailAddr = document.createElement('div');
  mailAddr.className = 'mail-addr';
  mailAddr.id = mail;
  mailAddr.setAttribute('open', 'false');
  const img = document.createElement('img');
  img.src = '../../static/off.svg';
  const span = document.createElement('span');
  span.innerText = mail;
  mailAddr.appendChild(img);
  mailAddr.appendChild(span);
  oneMail.appendChild(mailAddr);
  const mailBoxes = createMailBoxes(boxes);
  mailBoxes.style.display = 'none';
  oneMail.appendChild(mailBoxes);

  mailAddr.addEventListener('click', () => {
    // select for delete
    if (selectedMail !== mail) {
      if (selectedMail) {
        const lastMail = document.getElementById(selectedMail as string)!;
        lastMail.style.backgroundColor = 'transparent';
      }
      selectedMail = mail;
      mailAddr.style.backgroundColor = '#e0e5ff';
    }
    // open or close
    if (mailAddr.getAttribute('open') === 'false') {
      mailAddr.setAttribute('open', 'true');
      img.style.transform = 'rotate(90deg)';
      mailBoxes.style.display = 'flex';
    } else {
      mailAddr.setAttribute('open', 'false');
      img.style.transform = 'rotate(0deg)';
      mailBoxes.style.display = 'none';
    }
  });

  return oneMail;
}

/**
 * create a pop
 * @param inner pop content
 */
function createPop(inner: HTMLElement) {
  const body = document.body;
  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.appendChild(inner);
  body.appendChild(pop);
}

/**
 * remove a pop
 */
function removePop() {
  const body = document.body;
  const pop = document.getElementsByClassName('pop')[0];
  body.removeChild(pop);
}

// add mail: after click, create a pop to input mail information
document.getElementById('add-mail')?.addEventListener('click', () => {
  const inputPop = document.createElement('div');
  inputPop.className = 'input-pop';
  const title = document.createElement('div');
  title.className = 'input-pop-title';
  const titleInner = document.createElement('span');
  titleInner.className = 'input-pop-title-inner';
  titleInner.innerText = 'New email';
  title.appendChild(titleInner);
  const close = document.createElement('img');
  close.src = '../../static/close.svg';
  close.className = 'input-pop-close';
  close.addEventListener('click', removePop);
  title.appendChild(close);
  inputPop.appendChild(title);
  const inputArea = document.createElement('div');
  inputArea.className = 'input-pop-area';
  inputPop.appendChild(inputArea);

  function createInput(info: {
    label: string;
    id: string;
    password?: boolean;
    default?: string;
  }) {
    const container = document.createElement('div');
    container.className = 'input-pop-container';
    const labelElement = document.createElement('label');
    labelElement.innerText = info.label;
    labelElement.className = 'input-pop-label';
    const inputElement = document.createElement('input');
    inputElement.type = info.password ? 'password' : 'text';
    inputElement.value = info.default || '';
    inputElement.id = info.id;
    inputElement.className = 'input-pop-input';
    container.appendChild(labelElement);
    container.appendChild(inputElement);
    return container;
  }

  function setErrorMessage(msg: string, color?: string) {
    let error: HTMLElement | null = document.getElementsByClassName(
      'input-pop-error',
    )[0] as HTMLElement;
    if (!error) {
      error = document.createElement('div');
      error.className = 'input-pop-error';
    }
    error.innerText = msg;
    error.style.color = color || '#3e3e3e';
    inputPop.insertBefore(error, confirm);
  }

  const infos = [
    { label: 'imap server', id: 'imap' },
    { label: 'imap port', id: 'imap-port', default: '993' },
    { label: 'smtp server', id: 'smtp' },
    { label: 'smtp port', id: 'smtp-port', default: '465' },
    { label: 'email address', id: 'mail-addr' },
    { label: 'password', id: 'password', password: true },
    { label: 'Token (if needed)', id: 'accessToken' },
  ];
  infos.forEach((info) => {
    inputArea.appendChild(createInput(info));
  });

  const confirm = document.createElement('button');
  confirm.innerText = 'OK';
  confirm.className = 'input-pop-confirm';
  inputPop.appendChild(confirm);
  confirm.addEventListener('click', () => {
    setErrorMessage('fetch from server...', 'green');
    const inputs = document.getElementsByClassName('input-pop-input');
    const mail = {
      imap: (inputs[0] as HTMLInputElement).value,
      imapPort: (inputs[1] as HTMLInputElement).value,
      smtp: (inputs[2] as HTMLInputElement).value,
      smtpPort: (inputs[3] as HTMLInputElement).value,
      mailAddr: (inputs[4] as HTMLInputElement).value,
      password: (inputs[5] as HTMLInputElement).value,
      accessToken: (inputs[6] as HTMLInputElement).value,
    };
    setTimeout(() => {
      const res = window.mail.addNewMail(mail);
      if (res === true) removePop();
      else if (res === false) setErrorMessage('fail', 'red');
      else setErrorMessage(res, 'red');
    }, 100);
  });

  createPop(inputPop);
});

// del mail: after click, delete the selected mail
document.getElementById('del-mail')?.addEventListener('click', () => {
  if (selectedMail) {
    window.mail.delMail(selectedMail as string);
    selectedMail = false;
  }
});

// open how to add
document.getElementById('how-to-add')?.addEventListener('click', () => {
  window.mail.openHowToAdd();
});

// when mails update, update the left bar
const leftBar = document.getElementById('left-bar-accounts');
window.mail.onMailsUpdate((mails: []) => {
  console.log(mails);
  if (leftBar) leftBar.innerHTML = '';
  mails.forEach((mail: { mailAddr: string; boxes: string[] }) => {
    const inner = createOneMail(mail.mailAddr, mail.boxes);
    leftBar?.appendChild(inner);
  });
});

// go back
document.getElementById('left-bar-goback')?.addEventListener('click', () => {
  const accounts = document.getElementById('left-bar-accounts') as HTMLElement;
  const mails = document.getElementById('left-bar-mails') as HTMLElement;
  accounts.style.transform = 'translateX(0)';
  mails.style.transform = 'translateX(0)';
});

// show time
const setTime = (function setTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const weekStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const time = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const dateStr = `${month}/${day} ${weekStr[week]}`;
  document.getElementById('hello-time')!.innerText = time;
  document.getElementById('hello-date')!.innerText = dateStr;
  return setTime;
})();
setInterval(setTime, 1000);
