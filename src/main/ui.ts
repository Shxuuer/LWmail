import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';

export let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile('pages/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // mainWindow.webContents.openDevTools();
};

const createTray = () => {
  const showWindow = () => {
    if (mainWindow) mainWindow.show();
    else createWindow();
  };
  const tray = new Tray('./static/icon.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示', click: showWindow },
    { label: '退出', role: 'quit' },
  ]);
  tray.setToolTip('LWmail');
  tray.setContextMenu(contextMenu);
  tray.on('click', showWindow);
};

export { createWindow, createTray };
