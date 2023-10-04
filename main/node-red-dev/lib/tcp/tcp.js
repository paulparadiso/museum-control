const net = require('net');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class TCPDevice {

    constructor(config, ip, port = null) {
        const configPath = path.join(__dirname, `./config/${config}.yaml`);
        const configFile = fs.readFileSync(configPath, 'utf8');
        this.config = yaml.load(configFile);
        this.ip = ip;
        this.port = port || this.config.meta.defaultPort;
        this.send = this.printMessage;
    }

    printMessage(s) {
        console.log(s);
    }

    write(s, args = null) {
        const msg = this.config.messages[s];
        const client = new net.Socket();
        client.on('error', e => {
            error(e)
        });
        client.connect(this.port, this.ip, () => {
            let m;
            if (args !== null) {
                m = msg.message.replace("$1", args[this.config.messages[s].arg]);
            } else {
                m = msg.message
            }
            client.write(m, () => {
                if (msg.response) {
                    client.on('data', data => {
                        if (data.toString().includes(this.config.meta.ignore)) {
                            client.destroy();
                            return;
                        } else {
                            match(msg);
                        }
                    });
                } else {
                    this.send({ "message": s, "value": 1 });
                    client.destroy();
                }
            });
        });
    }

    error(e) {
        if (e.code === "ENOTFOUND") {
            this.send({ "message": "ERROR", "value": `[ERROR] No device at current address - (${this.ip}, ${this.port})` });
            client.destroy();
        }
        if (e.code === "ECONNREFUSED") {
            this.send({ "message": "ERROR", "value": `[ERROR] Connection refused by device - (${this.ip}, ${this.port})` });
            client.destroy();
        }
        if (e.code === "ETIMEDOUT") {
            this.send({ "message": "ERROR", "value": `[ERROR] Connection timed out - (${this.ip}, ${this.port})` });
            client.destroy();
        }
    }

    match(msg) {
        let matched = false;
        if (msg.buffer) {
            if (data[msg.match.index] === msg.match.value) {
                matched = true;
            }
        } else {
            const regex = new RegExp(msg.match);
            matched = regex.test(data.toString());
        }
        if (matched) {
            this.send({ "message": s, "value": msg.success })
        } else {
            this.send({ "message": s, "value": msg.failure })
        }
        client.destroy();
    }

    sendMessage(s, args) {
        if (this.config.messages[s] === undefined) {
            this.send("message not available on this device.");
        } else {
            this.write(s, args);
        }
    }
}

module.exports = TCPDevice;