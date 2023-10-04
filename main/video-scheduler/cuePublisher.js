const mqtt = require('mqtt');
const Scheduler = require('./scheduler');

const DEFAULT_BROKER = 'mqtt://172.16.1.72:1883';
const DEFAULT_CUE_TOPIC = 'museum/show/video/cue';

class CuePublisher {

    constructor(broker=DEFAULT_BROKER, cueTopic=DEFAULT_CUE_TOPIC, autoload=true) {
        this.mqttClient = mqtt.connect(broker);
        this.cueTopic = cueTopic;
        this.scheduler = null;
        this.monitor = this.logMessage;
        this.currentCue = null;
        /*
        if(autoload === true) {
            this.loadSchedule();
        }
        */
    }

    loadSchedule() {
        if(this.scheduler !== null) {
            delete this.scheduler;
        }
        this.scheduler = new Scheduler('schedule.yaml');
        this.scheduler.monitor = this.monitor;
        this.scheduler.load("part_1", "public_hours");
        this.scheduler.startClip = clip => {
            console.log(`Sending cue to ${this.cueTopic}`);
            this.mqttClient.publish(this.cueTopic, clip.toString());
            this.monitor(
                `[CUE_SCHEDULER]Sending cue: ${clip.toString()}`
            )
            this.currentCue = clip;
        }
    }

    getCue(cue) {
        return this.scheduler.getCue(cue);
    }

    getCurrentCue() {
        return this.currentCue;
    }

    getNextCue() {
        return this.scheduler.getNextCue();
    }

    logMessage(m) {
        console.log(`${m}`);
    }

    restart() {
        this.loadSchedule();
    }

}

exports.CuePublisher = CuePublisher;