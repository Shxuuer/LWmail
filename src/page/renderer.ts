import "./index.scss";
import "../assets/img/background.jpg";
import $ from "jquery";
// import {
//   createOneAccount,
//   createMailList,
// } from "./components/MailList/MailList";

// when mails update, update the left bar
window.mail.onMailsUpdate((accountBoxes: AccountBox[]) => {
  console.log(accountBoxes);
  // const leftBar = document.getElementById("left-bar-accounts");
  // if (leftBar) leftBar.innerHTML = "";
  // accountBoxes.forEach((accountBox: AccountBox) => {
  //   const inner = createOneAccount(accountBox.accountAddr, accountBox.boxes);
  //   leftBar?.appendChild(inner);
  // });
});

import { createHeader } from "./components/Header/Header";
import { createMailList } from "./components/MailList/MailList";
import { createPreview } from "./components/MailPreview/MailPreview";
$("body").append(
  $("<div>")
    .attr("id", "container")
    .append(createHeader())
    .append(
      $("<div>")
        .attr("id", "main")
        .append(createMailList())
        .append(createPreview()),
    ),
);
