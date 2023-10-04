const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const path = require('path');
require('electron-debug')({ showDevTools: false });

const activeInterfaces = ['udp'];
const interfaces = {};

const interfaceCallback = command => {
    console.log(command);
}

const config = {'callback': interfaceCallback, 'port': 5566};

const loadInterfaces = () => {
    activeInterfaces.map(interface => {
        interfaces.interface = require(`./interfaces/${interface}`)(config);
    })
}

const createWindow = () => {
    console.log('Creating window.', path.join(__dirname, 'preload.js'));
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    ipcMain.on('current-time', (event, time) => {
        //console.log(time);
    })

    win.loadFile('index.html');

    loadInterfaces();

    setTimeout(() => win.webContents.send('command', 'pause'), 2000);
    setTimeout(() => win.webContents.send('command', 'play'), 4000);
}

app.whenReady().then(() => {
    createWindow();
})  