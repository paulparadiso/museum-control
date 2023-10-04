const { contextBridge, ipcRenderer } = require('electron')
const MediaPlayer = require('./MediaPlayer');

console.log('loading preload');

contextBridge.exposeInMainWorld('bridge', {
    setCurrentTime: (time) => ipcRenderer.send('current-time', time),
    command: (message) => {
        ipcRenderer.on('command', message);
    }
})