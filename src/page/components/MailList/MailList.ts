import "./MailList.scss";
import dayjs from "dayjs";
import $ from "jquery";

let selectedMail: JQuery<HTMLElement> = null;

// jquery elements of mail list page
let accounts: JQuery<HTMLElement> = null;
let mails: JQuery<HTMLElement> = null;

export function setSelectMail(value: JQuery<HTMLElement>) {
  if (selectedMail === value) return;
  if (selectedMail) selectedMail.css("background-color", "transparent");
  selectedMail = value;
  if (selectedMail) selectedMail.css("background-color", "#e0e5ff");
}

export function getSelectMail(): JQuery<HTMLElement> {
  return selectedMail;
}

/**
 * Create mail list frame
 * @returns {JQuery<HTMLElement>} mail list frame
 */
export function createMailList(): JQuery<HTMLElement> {
  accounts = $("<div>").attr("id", "accounts");
  mails = $("<div>")
    .attr("id", "mails")
    .append(
      $("<div>")
        .attr("id", "goback")
        .append(
          $("<img>")
            .attr("src", require("../../../assets/img/off.svg"))
            .attr("alt", "goback"),
        )
        .append($("<span>").text("Go back"))
        .on("click", goBackToAccounts),
    )
    .append($("<div>").attr("id", "content"));

  return $("<div>").attr("id", "left-bar").append(accounts).append(mails);
}

/**
 * left bar accounts: show accounts page
 */
function goBackToAccounts() {
  accounts.css("transform", "translateX(0)");
  mails.css("transform", "translateX(0)");
}

/**
 * left bar accounts: show mails page
 * @param {Box} box - mails box
 */
function goForwardToMails(box: Box, accountAddr: string) {
  let mailContent = mails.children("#content");
  mailContent.html("");
  box.messages.forEach((m) =>
    mailContent.append(createMailThumbs(m, accountAddr, box.boxPath)),
  );
  accounts.css("transform", "translateX(-100%)");
  mails.css("transform", "translateX(-100%)");
}

function previewMail(message: Message, accountAddr: string, boxPath: string) {
  let htmlMessage: string = message.source;
  if (htmlMessage === undefined)
    htmlMessage = window.mail.getHtmlByUid(accountAddr, boxPath, message.uid);
  $("#mail-detail").html(htmlMessage).css("display", "block");
}

/**
 * handle click mail address, open or close mail boxes
 * @param event click event
 */
function handleClickMailAddr(event: JQuery.ClickEvent) {
  const target = $(event.currentTarget);
  setSelectMail(target);
  if (target.attr("opened") === "false") {
    target.attr("opened", "true");
    target.children("img").css("transform", "rotate(90deg)");
    target.next().css("display", "flex");
  } else {
    target.attr("opened", "false");
    target.children("img").css("transform", "rotate(0deg)");
    target.next().css("display", "none");
  }
}

/**
 * Create mail list
 * @param {AccountBox[]} message - account boxes
 */
function createMailThumbs(
  message: Message,
  accountAddr: string,
  boxPath: string,
): JQuery<HTMLElement> {
  return $("<div>")
    .on("click", () => previewMail(message, accountAddr, boxPath))
    .append(
      $("<div>")
        .addClass("text")
        .append($("<div>").addClass("text-from").text(message.from.name))
        .append($("<div>").addClass("text-title").text(message.subject))
        .append(
          $("<div>")
            .addClass("text-time")
            .text(dayjs(message.date).format("ddd MM/DD")),
        ),
    );
}

/**
 * Create one account
 * @param accountBox - account box
 */
export function createOneAccount(accountBox: AccountBox) {
  const boxesElements = accountBox.boxes.map((box) =>
    $("<div>")
      .text(box.boxPath)
      .on("click", () => goForwardToMails(box, accountBox.accountAddr)),
  );

  const account = $("<div>")
    .append(
      $("<div>")
        .addClass("mail-addr")
        .attr("opened", "false")
        .append($("<img>").attr("src", require("../../../assets/img/off.svg")))
        .append($("<span>").text(accountBox.accountAddr))
        .on("click", handleClickMailAddr),
    )
    .append(
      $("<div>")
        .addClass("mail-boxes")
        .css("display", "none")
        .append(boxesElements),
    );
  accounts.append(account);
}

/**
 * Update mail list
 * @param {AccountBox[]} accountBoxes - account box
 */
export function updateMailList(accountBoxes: AccountBox[]) {
  accounts.html("");
  accountBoxes.forEach((accountBox) => createOneAccount(accountBox));
}
