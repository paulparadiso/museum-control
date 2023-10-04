const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const schedule = require('node-schedule');
const mqtt = require('mqtt');
const _ = require('lodash');
const topics = require('../../dashboard/src/Topics');

const MUSEUM_SHOW_STATUS_TOPIC = topics.MQTT_SHOW_STATE_TOPIC
const SCHEDULER_PARAMS_CURRENT_TOPIC = topics.MQTT_APP_PARAMS_CURRENT.replace('<appname>', 'dailyscheduler');
const SCHEDULER_PARAMS_SET_TOPIC = topics.MQTT_APP_PARAMS_SET.replace('<appname>', 'dailyscheduler');

module.exports = () => {

    console.log('starting up.');
    let onTime = '';
    let offTime = '';
    let enabled = true;
    mqttClient = mqtt.connect('mqtt://localhost:1883');

    const loadSchedule = () => {
        const schedulePath = path.join(__dirname, 'schedule.yaml');
        const scheduleFile = fs.readFileSync(schedulePath, 'utf8');
        const scheduleYaml = yaml.load(scheduleFile);
        parseSchedule(scheduleYaml);
        setSchedule();
        console.log(onTime, offTime);
    } 

    const parseSchedule = (scheduleYaml) => {
        if(scheduleYaml.show.hasOwnProperty("on")) {
            onTime = scheduleYaml.show.on;
        } 
        if(scheduleYaml.show.hasOwnProperty("off")) {
            offTime = scheduleYaml.show.off;
        } 
    }

    const setSchedule = () => {
        clearSchedule();   
        schedule.scheduleJob(makeCronString(onTime), () => {publishMessage('on')});
        schedule.scheduleJob(makeCronString(offTime), () => {publishMessage('off')});
    }

    const clearSchedule = () => {
        const jobNames = _.keys(schedule.scheduledJobs);
        for(let name of jobNames) schedule.cancelJob(name);
    }

    const makeCronString = (t) => {
        let tokens = t.split(":");
        return `0 ${tokens[1]} ${tokens[0]} * * *`;
    }

    const writeYaml = () => {
        fs.writeFileSync(path.join(__dirname, 'schedule.yaml'), 
                         yaml.dump({"show": {"onTime": onTime, "offTime": offTime}}), 
                         'utf8');
    }

    const configureMQTT = () => {
        mqttClient.on('connect', () => {
            mqttClient.subscribe(SCHEDULER_PARAMS_SET_TOPIC);
        });
        mqttClient.on("message", (topic, message) => {
            processMessage(topic, message);
        });
    }

    const processMessage = (topic, message) => {
        if(topic !== SCHEDULER_PARAMS_SET_TOPIC) return;
        const parsedMessage = JSON.parse(message);
        if(parsedMessage.hasOwnProperty('onTime')) {
            onTime = parsedMessage.onTime;
        }
        if(parsedMessage.hasOwnProperty('offTime')) {
            offTime = parsedMessage.offTime;
        }
        if(parsedMessage.hasOwnProperty('enabled')) {
            enabled = parsedMessage.enabled;
        }
        setSchedule();
        console.log(onTime, offTime);
        writeYaml();
    }

    const publishMessage = message => {
        if(!enabled) {
            return;
        }
        mqttClient.publish(MUSEUM_SHOW_STATUS_TOPIC, message);
    }

    const publishParams = () => {
        const params = {'onTime': onTime, 'offTime': offTime, 'enabled': enabled};
        mqttClient.publish(SCHEDULER_PARAMS_CURRENT_TOPIC, JSON.stringify(params));
    }

    const init = () => {
        loadSchedule();
        configureMQTT();
        setInterval(() => publishParams(), 1000);
    }

    init();
}