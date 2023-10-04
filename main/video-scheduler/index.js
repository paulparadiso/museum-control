const Scheduler = require('./scheduler');
const express = require('express');
const TCPDevice = require('../node-red-contrib-christie-projector/tcp/tcp');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

var client = mqtt.connect('mqtt://172.16.1.72:1883');

client.on('connect', () => {
    client.subscribe('show', err => {
        if(err) {
            console.log('error connecting to topic show.');
        }
    });
    client.subscribe('playback', err => {
        if(err) {
            console.log('error connecting to topic playback');
        }
    })
});

client.on('message', (topic, message) => {
    console.log(`
        MQTT: Message Received:
        \t ${topic}
        \t ${message}
    `)
})

const playbackPro = new TCPDevice("playback-pro", "172.16.3.83");

const scheduler = new Scheduler('schedule.yaml');
//scheduler.load("part_1","special_morning_hours");

console.log(scheduler.getClips());
console.log(scheduler.getParts());
console.log(scheduler.getSchedules());

scheduler.startClip = clip => {
    playbackPro.sendMessage("loadClipTake", args={"clip": clip});
}

app.use(express.static('public'));

app.get("/", (res, req) => {
    res.sendfile(__dirname + '/public/index.html');
});

app.get(('/content'), (req, res) => {
    //res.json({'content':'stuff'});
    var clips = scheduler.getClips();
    var parts = scheduler.getParts();
    var schedules = scheduler.getSchedules();
    res.json({
        clips: clips,
        parts: parts,
        schedules: schedules
    })
});

app.get('/status', (req, res) => {
    res.json({'status': 'ok'});
});

app.post('/set', (req, res) => {

});

app.listen(port, () => {
    console.log(`Scheduler running on - ${port}`);
});
