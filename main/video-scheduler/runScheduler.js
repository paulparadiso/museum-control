const Scheduler = require('./scheduler');
const path = require('path');
const TCPDevice = require(path.join(__dirname, '../lib/tcp/tcp'));

const playbackPro = new TCPDevice("playback-pro", "172.16.3.83");

const scheduler = new Scheduler('schedule.yaml');

scheduler.logMessage = m => {
    console.log(`Incoming - ${m}`);
}

scheduler.load("part_1","public_hours");

scheduler.startClip = clip => {
    console.log(`Running ${clip}`);
    playbackPro.sendMessage("loadClipTake", args={"clip": clip});
}
