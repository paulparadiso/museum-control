const pjlink = require('pjlink')

class PJLinkController {

    constructor(ip, port, password) {
        this.ip = ip;
        this.port = port;
        this.password = password;
        this.projector = new pjlink(this.ip, this.port, this.password);
        this.send = this.printMessage;
    }

    printMessage(m) {
        console.log(m);
    }

    sendMessage(s) {
        console.log(s);
        switch (s) {
            case 'powerOn':
                this.projector.powerOn(err => {
                    if (err) {
                        this.send(`[ERROR]: PJLink: ${err}: ${this.ip}`);
                    } else {
                        this.send({ "message": s, "value": 1 })
                    }
                });
                break;
            case 'powerOff':
                this.projector.powerOff(err => {
                    if (err) {
                        this.send(`[ERROR]: PJLink: ${err}: ${this.ip}`);
                    } else {
                        this.send({ "message": s, "value": 1 })
                    }
                });
                break;
            case 'powerStatus':
                this.projector.getPowerState((err, state) => {
                    if (err) {
                        this.send(`[ERROR]: PJLink: ${err}: ${this.ip}`);
                    } else {
                        if (state > 0) {
                            this.send({ "message": s, "value": 1 });
                        } else {
                            this.send({ "message": s, "value": 0 });
                        }
                    }
                });
                break;
            case 'shutterOn':
                this.projector.setMute(true, true, err => {
                    if (err) {
                        this.send(`[ERROR]: PJLink: ${err}: ${this.ip}`);
                    } else {
                        this.send({ "message": s, "value": 1 })
                    }
                });
                break;
            case 'shutterOff':
                this.projector.setMute(false, false, err => {
                    if (err) {
                        this.send(`[ERROR]: PJLink: ${err}: ${this.ip}`);
                    } else {
                        this.send({ "message": s, "value": 1 })
                    }
                });
                break;
            case 'shutterStatus':
                this.projector.getMute((err, state) => {
                    if (err) {
                        this.send(`[ERROR]: PJLink: ${err}: ${this.ip}`);
                    } else {
                        if (state['video'] === true) {
                            this.send({ "message": s, "value": 1 });
                        } else {
                            this.send({ "message": s, "value": 0 });
                        }
                    }
                });
                break;
        }
    }
}

module.exports = PJLinkController;