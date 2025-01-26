import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";
import icon from "../assets/img/icon.png";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  // mainWindow.hide();
  mainWindow.setMenu(null);
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow?.hide();
  });
  mainWindow.webContents.openDevTools();
};

const createTray = () => {
  const showWindow = () => {
    if (mainWindow) mainWindow.show();
    else createWindow();
  };
  const quitApp = () => {
    app.exit();
  };
  const image = nativeImage.createFromDataURL(icon);
  const tray = new Tray(image);
  const contextMenu = Menu.buildFromTemplate([
    { label: "显示", click: showWindow },
    { label: "退出", role: "quit", click: quitApp },
  ]);
  tray.setToolTip("LWmail");
  tray.setContextMenu(contextMenu);
  tray.on("click", showWindow);
};

export { createWindow, createTray };
