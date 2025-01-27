import "./HeaderButton.css";

export function createHeaderButton(
  imgSrc: string,
  alt: string,
  title: string,
  onClick: (this: GlobalEventHandlers, ev: MouseEvent) => any,
) {
  const button = document.createElement("div");
  button.classList.add("header-btn");
  button.onclick = onClick;
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = alt;
  img.title = title;
  button.appendChild(img);
  return button;
}
