const TCPDevice = require('../lib/tcp/tcp');

let p = new TCPDevice("playback-pro", '172.16.3.83');

p.send = m => {
    console.log("Received Message:");
    console.log(`\t${m.message}`);
    console.log(`\t${m.value}`);
}

console.log(p.sendMessage("loadClipTake"), args={'clip': '1'});