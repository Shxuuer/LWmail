import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as path from 'path';
import { LocalStorage } from 'node-localstorage';

let mainWindow: BrowserWindow | null = null;

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
  mainWindow.webContents.openDevTools();
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

const handleIPC = () => {
  ipcMain.on('safe-storage-mail-info', (event, mail) => {
    const localStorage: LocalStorage = new LocalStorage(
      path.join(__dirname, 'config'),
    );
    localStorage.setItem('mail', JSON.stringify(mail));
    console.log(localStorage.getItem('mail'));
  });
};

app.whenReady().then(() => {
  createTray();
  handleIPC();
  createWindow();
});

app.on('window-all-closed', () => {});
