const mqtt = require('mqtt');
const path = require('path');
const TCPDevice = require(path.join(__dirname, '../lib/tcp/tcp'));

const DEFAULT_BROKER = 'mqtt://172.16.1.72:1883';
const DEFAULT_CUE_TOPIC = 'museum/show/video/cue';
const DEFAULT_PLAYBACK_PRO_IP = '172.16.3.83';

class CueSubscriber{

    constructor(broker=DEFAULT_BROKER, cueTopic = DEFAULT_CUE_TOPIC, playbackProIP=DEFAULT_PLAYBACK_PRO_IP) {
        this.playbackPro = new TCPDevice("playback-pro", playbackProIP);
        this.mqttClient = mqtt.connect(broker);
        this.cueTopic = cueTopic;
        this.mqttClient.on('connect', () => {
            this.mqttClient.subscribe(cueTopic);
        });
        this.mqttClient.on("message", (topic, message) => {
            if(topic === this.cueTopic) {
                this.playbackPro.sendMessage("loadClipTake", {"clip":message.toString()});
                this.monitor(
                    `[PLAYBACK_PRO_CONTROL]Received cue: ${message.toString()}`
                );
            }
        })
    }

    logMessage(s) {
        console.log(s);
    }
}

exports.CueSubscriber = CueSubscriber;