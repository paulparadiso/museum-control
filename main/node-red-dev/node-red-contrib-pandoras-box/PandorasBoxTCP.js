const net = require('net');

class PandorasBoxTCP {

    constructor(ip, fullscreenId, windowedId) {
        this.ip = ip;
        this.port = 1071;
        this.fullscreenId = fullscreenId;
        this.windowedId = windowedId;
        this.send = this.printMessage;
    }

    printMessage(s) {
        console.log(s);
    }

    sendMessage(msg) {
        if(msg === 'fullscreenAll') {
            this.sendFullscreenAll();
        }
        if(msg === 'windowedAll') {
            this.sendWindowedAll();
        }
    }

    tcpSend(msg) {
        const client = new net.Socket();
        client.on('error', error => {
            if (error.code === "ENOTFOUND") {
                this.send({ "message": "ERROR", "value": `[ERROR] No device at current address - (${this.ip}, ${this.port})` });
                client.destroy();
            }
            if (error.code === "ECONNREFUSED") {
                this.send({ "message": "ERROR", "value": `[ERROR] Connection refused by device - (${this.ip}, ${this.port})` });
                client.destroy();
            }
            if (error.code === "ETIMEDOUT") {
                this.send({ "message": "ERROR", "value": `[ERROR] Connection timed out - (${this.ip}, ${this.port})` });
                client.destroy();
            }
        });
        client.connect(this.port, this.ip, () => {
            console.log(`Sending message - ${msg}`);
            client.write(msg, () => {
                this.send({ "message": msg, "value": 1 });
                client.destroy();
            });
        });
    }

    sendFullscreen(fId) {
        const fullscreenCmd = `{WDCustomScriptClick(${fId})}`;
        this.tcpSend(fullscreenCmd);
    }

    sendWindowed(wId) {
        const windowedCmd = `{WDCustomScriptClick(${wId})}`;
        this.tcpSend(windowedCmd)
    }

    sendFullscreenAll() {
        const fullscreenCmd = `{WDCustomScriptClick(${this.fullscreenId})}`;
        this.send(fullscreenCmd);
        this.tcpSend(fullscreenCmd);
    }

    sendWindowedAll() {
        const windowedCmd = `{WDCustomScriptClick(${this.windowedId})}`;
        this.send(windowedCmd);
        this.tcpSend(windowedCmd);
    }

}

module.exports = PandorasBoxTCP;