export let selectedMail: string | boolean = false;

export function setSelectMail(value: string | boolean) {
  selectedMail = value;
}

/**
 * create one mail preview
 * @param mailInfo mail information
 * @returns HTMLElement mail preview
 */
function createOneMailPreview(mailInfo: Message) {
  const mail = document.createElement("div");
  mail.className = "left-bar-mails-content-each";
  const mailText = document.createElement("div");
  mailText.className = "left-bar-mails-content-each-text";
  const mailTextFrom = document.createElement("div");
  mailTextFrom.className = "left-bar-mails-content-each-text-from";
  mailTextFrom.innerText = mailInfo.from.name;
  const mailTextTitle = document.createElement("div");
  mailTextTitle.className = "left-bar-mails-content-each-text-title";
  mailTextTitle.innerText = mailInfo.subject;
  const mailTextTime = document.createElement("div");
  mailTextTime.className = "left-bar-mails-content-each-text-time";
  const edate = new Date(mailInfo.date);
  const week = edate.getDay();
  const weekStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const month = edate.getMonth() + 1;
  const day = edate.getDate();
  mailTextTime.innerText = `${weekStr[week]} ${month}/${day}`;
  mailText.appendChild(mailTextFrom);
  mailText.appendChild(mailTextTitle);
  mailText.appendChild(mailTextTime);
  mail.appendChild(mailText);
  mail.addEventListener("click", () => {
    const mailDetail = document.getElementById("mail-detail") as HTMLElement;
    mailDetail.style.display = "block";
    mailDetail.innerHTML = mailInfo.source;
  });
  return mail;
}

/**
 * create a mail box
 * @param box box name
 * @param accountIndex account index
 * @param boxIndex box index
 * @returns HTMLElement mail box
 */
function createMailBox(box: Box) {
  const mailBox = document.createElement("div");
  mailBox.className = "mail-box";
  const mailBoxName = document.createElement("span");
  mailBoxName.className = "mail-box-name";
  mailBoxName.innerText = box.boxName;
  mailBoxName.addEventListener("click", () => {
    const accounts = document.getElementById(
      "left-bar-accounts",
    ) as HTMLElement;
    const mails = document.getElementById("left-bar-mails") as HTMLElement;
    const mailList = document.getElementById(
      "left-bar-mails-content",
    ) as HTMLElement;
    mailList.innerHTML = "";
    box.messages.forEach((mailInfo) => {
      const mail = createOneMailPreview(mailInfo);
      mailList.appendChild(mail);
    });
    accounts.style.transform = "translateX(-100%)";
    mails.style.transform = "translateX(-100%)";
  });
  mailBox.appendChild(mailBoxName);
  return mailBox;
}

/**
 * create mail boxes
 * @param boxes box names
 * @param accountIndex account index
 * @returns HTMLElement mail boxes
 */
function createMailBoxes(boxes: Box[]) {
  const mailBoxes = document.createElement("div");
  mailBoxes.className = "mail-boxes";
  boxes.forEach((box) => {
    mailBoxes.appendChild(createMailBox(box));
  });
  return mailBoxes;
}

/**
 * create one account element
 * @param mail account address
 * @param boxes account boxes
 * @returns HTMLElement mail element
 */
export function createOneAccount(mail: string, boxes: Box[]) {
  const oneMail = document.createElement("div");
  oneMail.className = "one-mail";
  const mailAddr = document.createElement("div");
  mailAddr.className = "mail-addr";
  mailAddr.id = mail;
  mailAddr.setAttribute("open", "false");
  const img = document.createElement("img");
  img.src = require("../../../assets/img/close.svg");
  const span = document.createElement("span");
  span.innerText = mail;
  mailAddr.appendChild(img);
  mailAddr.appendChild(span);
  oneMail.appendChild(mailAddr);
  const mailBoxes = createMailBoxes(boxes);
  mailBoxes.style.display = "none";
  oneMail.appendChild(mailBoxes);

  mailAddr.addEventListener("click", () => {
    // select for delete
    if (selectedMail !== mail) {
      if (selectedMail) {
        const lastMail = document.getElementById(selectedMail as string)!;
        lastMail.style.backgroundColor = "transparent";
      }
      selectedMail = mail;
      mailAddr.style.backgroundColor = "#e0e5ff";
    }
    if (mailAddr.getAttribute("open") === "false") {
      mailAddr.setAttribute("open", "true");
      img.style.transform = "rotate(90deg)";
      mailBoxes.style.display = "flex";
    } else {
      mailAddr.setAttribute("open", "false");
      img.style.transform = "rotate(0deg)";
      mailBoxes.style.display = "none";
    }
  });
  return oneMail;
}

/**
 * create a pop
 * @param inner pop content
 */
export function createPop(inner: HTMLElement) {
  const body = document.body;
  const pop = document.createElement("div");
  pop.className = "pop";
  pop.appendChild(inner);
  body.appendChild(pop);
}

/**
 * remove a pop
 */
export function removePop() {
  const body = document.body;
  const pop = document.getElementsByClassName("pop")[0];
  body.removeChild(pop);
}
