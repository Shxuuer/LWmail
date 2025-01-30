import "./Header.scss";
import $ from "jquery";
import { createAddAccountPop } from "../WindowPop/WindowPop";
// import { selectedMail, setSelectMail } from "../MailList/MailList";

const buttons = [
  {
    imgSrc: require("../../../assets/img/add.svg"),
    alt: "add-mail",
    title: "add a new email account",
    onClick: createAddAccountPop,
  },
  {
    imgSrc: require("../../../assets/img/del.svg"),
    alt: "del-mail",
    title: "delete selected email account",
    onClick: () => {
      // if (!selectedMail) return;
      // window.mail.delAccount(selectedMail as string);
      // setSelectMail(false);
    },
  },
  {
    imgSrc: require("../../../assets/img/question.svg"),
    alt: "how-to-add",
    title: "how to add a email account",
    onClick: () => {
      window.mail.openHowToAdd();
    },
  },
];

function createHeaderButton(buttonInfo: {
  imgSrc: string;
  alt: string;
  title: string;
  onClick?: (this: GlobalEventHandlers, ev: MouseEvent) => any;
}): JQuery<HTMLElement> {
  return $("<div>")
    .addClass("header-btn")
    .on({ click: buttonInfo.onClick })
    .append(
      $("<img>")
        .attr("src", buttonInfo.imgSrc)
        .attr("alt", buttonInfo.alt)
        .attr("title", buttonInfo.title),
    );
}

export function createHeader() {
  const header = $("<div>").attr("id", "header");
  buttons.forEach((buttonInfo) => {
    header.append(createHeaderButton(buttonInfo));
  });
  return header;
}
