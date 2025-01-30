import "./WindowPop.scss";
import $ from "jquery";

let pop: JQuery<HTMLElement> = null;

/**
 * create pop
 */
function createPop(inner: JQuery<HTMLElement>): void {
  pop = $("<div>").addClass("pop").append(inner);
  $("body").append(pop);
}

/**
 * remove a pop
 */
function removePop(): void {
  if (!pop) return;
  pop.fadeOut(200, () => {
    pop.remove();
    pop = null;
  });
}

export function createAddAccountPop() {
  const infos = [
    { label: "imap server", id: "imap" },
    { label: "imap port", id: "imap-port", default: "993" },
    { label: "smtp server", id: "smtp" },
    { label: "smtp port", id: "smtp-port", default: "465" },
    { label: "email address", id: "mail-addr" },
    { label: "password", id: "password", password: true },
    { label: "Token (if needed)", id: "accessToken" },
  ];

  /**
   * create input box
   * @returns {JQuery<HTMLElement>} input area
   */
  function createInputBox(): JQuery<HTMLElement>[] {
    return infos.map((info) => {
      return $("<div>")
        .addClass("input-pop-container")
        .append($("<label>").text(info.label).addClass("input-pop-label"))
        .append(
          $("<input>")
            .attr("type", info.password ? "password" : "text")
            .val(info.default || "")
            .attr("id", info.id)
            .addClass("input-pop-input"),
        );
    });
  }

  /**
   * set error message
   * @param msg error message
   * @param color color of the message
   */
  function setErrorMessage(msg: string, color?: string) {
    let error = $("#input-pop-error");
    error.text(msg);
    error.css("color", color || "#3e3e3e");
  }

  function checkAccountInfo() {
    setErrorMessage("fetch from server...", "green");
    const inputs = $(".input-pop-input")
      .map((_, el) => $(el).val())
      .get();
    const mail: Account = {
      imap: inputs[0] as string,
      imapPort: inputs[1] as string,
      smtp: inputs[2] as string,
      smtpPort: inputs[3] as string,
      mailAddr: inputs[4] as string,
      password: inputs[5] as string,
      accessToken: inputs[6] as string,
    };
    setTimeout(() => {
      const res = window.mail.addAccount(mail);
      if (res === true) removePop();
      else setErrorMessage(res || "fail", "red");
    }, 100);
  }

  const popInner = $("<div>")
    .attr("id", "input-pop")
    .append(
      $("<div>")
        .attr("id", "input-pop-title")
        .append($("<span>").text("New email"))
        .append(
          $("<img>")
            .attr("src", require("../../../assets/img/close.svg"))
            .on("click", removePop),
        ),
    )
    .append($("<div>").attr("id", "input-pop-area").append(createInputBox()))
    .append($("<div>").attr("id", "input-pop-error"))
    .append(
      $("<button>")
        .text("OK")
        .attr("id", "input-pop-confirm")
        .on("click", checkAccountInfo),
    );

  createPop(popInner);
}
