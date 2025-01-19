const info: HTMLElement = document.getElementById('info')!;

window.mail.getMailBoxes().then((boxes: any) => {
  info.innerText = JSON.stringify(boxes);
});
