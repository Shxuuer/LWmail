import "./index.css";
import "../assets/img/background.jpg";
import {
  selectedMail,
  createOneAccount,
  createPop,
  removePop,
  setSelectMail,
} from "./components/MailList/MailList";

// add mail: after click, create a pop to input mail information
function addMail() {
  const inputPop = document.createElement("div");
  inputPop.className = "input-pop";
  const title = document.createElement("div");
  title.className = "input-pop-title";
  const titleInner = document.createElement("span");
  titleInner.className = "input-pop-title-inner";
  titleInner.innerText = "New email";
  title.appendChild(titleInner);
  const close = document.createElement("img");
  close.src = require("../assets/img/close.svg");
  close.className = "input-pop-close";
  close.addEventListener("click", removePop);
  title.appendChild(close);
  inputPop.appendChild(title);
  const inputArea = document.createElement("div");
  inputArea.className = "input-pop-area";
  inputPop.appendChild(inputArea);

  function createInput(info: {
    label: string;
    id: string;
    password?: boolean;
    default?: string;
  }) {
    const container = document.createElement("div");
    container.className = "input-pop-container";
    const labelElement = document.createElement("label");
    labelElement.innerText = info.label;
    labelElement.className = "input-pop-label";
    const inputElement = document.createElement("input");
    inputElement.type = info.password ? "password" : "text";
    inputElement.value = info.default || "";
    inputElement.id = info.id;
    inputElement.className = "input-pop-input";
    container.appendChild(labelElement);
    container.appendChild(inputElement);
    return container;
  }

  function setErrorMessage(msg: string, color?: string) {
    let error: HTMLElement | null = document.getElementsByClassName(
      "input-pop-error"
    )[0] as HTMLElement;
    if (!error) {
      error = document.createElement("div");
      error.className = "input-pop-error";
    }
    error.innerText = msg;
    error.style.color = color || "#3e3e3e";
    inputPop.insertBefore(error, confirm);
  }

  const infos = [
    { label: "imap server", id: "imap" },
    { label: "imap port", id: "imap-port", default: "993" },
    { label: "smtp server", id: "smtp" },
    { label: "smtp port", id: "smtp-port", default: "465" },
    { label: "email address", id: "mail-addr" },
    { label: "password", id: "password", password: true },
    { label: "Token (if needed)", id: "accessToken" },
  ];
  infos.forEach((info) => {
    inputArea.appendChild(createInput(info));
  });

  const confirm = document.createElement("button");
  confirm.innerText = "OK";
  confirm.className = "input-pop-confirm";
  inputPop.appendChild(confirm);
  confirm.addEventListener("click", () => {
    setErrorMessage("fetch from server...", "green");
    const inputs = document.getElementsByClassName("input-pop-input");
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
      const res = window.mail.addAccount(mail);
      if (res === true) removePop();
      else if (res === false) setErrorMessage("fail", "red");
      else setErrorMessage(res, "red");
    }, 100);
  });
  createPop(inputPop);
}

// when mails update, update the left bar
const leftBar = document.getElementById("left-bar-accounts");
window.mail.onMailsUpdate((accountBoxes: AccountBox[]) => {
  console.log(accountBoxes);
  if (leftBar) leftBar.innerHTML = "";
  accountBoxes.forEach((accountBox: AccountBox) => {
    const inner = createOneAccount(accountBox.accountAddr, accountBox.boxes);
    leftBar?.appendChild(inner);
  });
});

// go back
document.getElementById("left-bar-goback")?.addEventListener("click", () => {
  const accounts = document.getElementById("left-bar-accounts") as HTMLElement;
  const mails = document.getElementById("left-bar-mails") as HTMLElement;
  accounts.style.transform = "translateX(0)";
  mails.style.transform = "translateX(0)";
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
  const weekStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const time = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  const dateStr = `${month}/${day} ${weekStr[week]}`;
  document.getElementById("hello-time")!.innerText = time;
  document.getElementById("hello-date")!.innerText = dateStr;
  return setTime;
})();
setInterval(setTime, 1000);

// show header buttons
import { createHeaderButton } from "./components/HeaderButton/HeaderButton";
const header = document.getElementById("header");
header?.appendChild(
  createHeaderButton(
    require("../assets/img/add.svg"),
    "add-mail",
    "add a new email account",
    addMail
  )
);
header?.appendChild(
  createHeaderButton(
    require("../assets/img/del.svg"),
    "del-mail",
    "delete selected email account",
    () => {
      if (selectedMail) {
        window.mail.delAccount(selectedMail as string);
        setSelectMail(false);
      }
    }
  )
);
header?.appendChild(
  createHeaderButton(
    require("../assets/img/question.svg"),
    "how-to-add",
    "how to add a email account",
    () => {
      window.mail.openHowToAdd();
    }
  )
);
