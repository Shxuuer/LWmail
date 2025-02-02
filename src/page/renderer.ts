import "./index.scss";
import "../assets/img/background.jpg";
import $ from "jquery";

import { createHeader } from "./components/Header/Header";
import { createMailList, updateMailList } from "./components/MailList/MailList";
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

// when mails update, update the left bar
window.mail.onMailsUpdate((accountBoxes: AccountBox[]) => {
  console.log(accountBoxes);
  updateMailList(accountBoxes);
});

// open external link in browser
$(document).on("click", "a", function (event) {
  event.preventDefault();
  window.mail.openBrowser(this.href);
});
