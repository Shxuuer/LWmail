import "./Header.scss";
import $ from "jquery";
import { createAddAccountPop } from "../WindowPop/WindowPop";
import { getSelectMail, setSelectMail } from "../MailList/MailList";

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
      const selectedMail = getSelectMail();
      if (!selectedMail) return;
      window.mail.delAccount(selectedMail.attr("address"));
      setSelectMail(null);
    },
  },
  {
    imgSrc: require("../../../assets/img/question.svg"),
    alt: "how-to-add",
    title: "how to add a email account",
    onClick: () => {
      const url: string =
        "https://github.com/Shxuuer/LWmail/blob/master/doc/add-new-account.md";
      window.mail.openBrowser(url);
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
