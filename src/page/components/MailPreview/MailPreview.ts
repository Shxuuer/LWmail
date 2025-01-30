import "./MailPreview.scss";
import $ from "jquery";
import dayjs from "dayjs";

export function createPreview() {
  return $("<div>")
    .attr("id", "preview")
    .append($("<div>").attr("id", "hello-time"))
    .append($("<div>").attr("id", "hello-date"))
    .append(
      $("<div>")
        .attr("id", "hello-quote")
        .text("精诚所至，金石为开。——《汉书·王莽传》"),
    )
    .append($("<div>").attr("id", "mail-detail"));
}

// show time
(function setTime() {
  const now = dayjs();
  $("#hello-time")?.text(now.format("HH:mm:ss"));
  $("#hello-date")?.text(now.format("MM/DD ddd"));
  setTimeout(setTime, 1000);
})();
