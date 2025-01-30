import "./MailList.scss";
import dayjs from "dayjs";
import $ from "jquery";

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
  const edate = dayjs(mailInfo.date);
  mailTextTime.innerText = edate.format("ddd MM/DD");
  mailText.appendChild(mailTextFrom);
  mailText.appendChild(mailTextTitle);
  mailText.appendChild(mailTextTime);
  mail.appendChild(mailText);
  mail.addEventListener("click", () => {
    const mailDetail = document.getElementById("mail-detail") as HTMLElement;
    mailDetail.style.display = "block";
    if (mailInfo.source === undefined) {
      window.mail.getHtmlByUid(mailInfo.to.address, "INBOX", mailInfo.uid);
    }
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
  mailBoxName.innerText = box.boxPath;
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
  img.src = require("../../../assets/img/off.svg");
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
 * create a go back button
 */
function createMailListGoBack() {
  const leftBarGoBack = document.getElementById("left-bar-goback")!;
  const img = document.createElement("img");
  img.src = require("../../../assets/img/off.svg");
  img.alt = "goback";
  const span = document.createElement("span");
  span.innerText = "Go back";
  leftBarGoBack.appendChild(img);
  leftBarGoBack.appendChild(span);
  function goBack() {
    const accounts = document.getElementById(
      "left-bar-accounts",
    ) as HTMLElement;
    const mails = document.getElementById("left-bar-mails") as HTMLElement;
    accounts.style.transform = "translateX(0)";
    mails.style.transform = "translateX(0)";
  }
  leftBarGoBack.addEventListener("click", goBack);
}

function createLeftBarFrame() {
  $("<div>").attr("id", "left-bar-accounts").addClass("left-bar-item");
  $("<div>").attr("id", "left-bar-mails").addClass("left-bar-item");
  $("<div>").attr("id", "left-bar-mails-content");
  $("<div>").attr("id", "left-bar-goback");
  return $("<div>").attr("id", "left-bar");
  const leftBarAccounts = document.createElement("div");
  leftBarAccounts.id = "left-bar-accounts";
  leftBarAccounts.className = "left-bar-item";

  const leftBarMails = document.createElement("div");
  leftBarMails.id = "left-bar-mails";
  leftBarMails.className = "left-bar-item";

  const leftBarMailsContent = document.createElement("div");
  leftBarMailsContent.id = "left-bar-mails-content";

  const leftBarGoBack = document.createElement("div");
  leftBarGoBack.id = "left-bar-goback";

  const leftBar = document.getElementById("left-bar")!;
  leftBar.appendChild(leftBarAccounts);
  leftBar.appendChild(leftBarMails);
  createMailListGoBack();
}

export function createMailList() {
  return createLeftBarFrame();
}
