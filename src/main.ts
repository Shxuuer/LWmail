import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as path from 'path';
import { mailServices } from './mail/mailManager';

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

const handleIPC = () => {
  ipcMain.handle('get-mail-boxes', async () => {
    // return mailServices.map(
    //   async (mailService) => await mailService.getMailBoxes(),
    // );
    return mailServices[0].getMailBoxes();
    // return mailServices.map((mailService) => mailService.getMailBoxes());
  });
  ipcMain.handle('get-mail-box', async (event, boxName: string) => {
    return mailServices.map(
      async (mailService) => await mailService.getMailBox(boxName),
    );
  });
};

app.whenReady().then(() => {
  createTray();
  handleIPC();
});

app.on('window-all-closed', () => {});
