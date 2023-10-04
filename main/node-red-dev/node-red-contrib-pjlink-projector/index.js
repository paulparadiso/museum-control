const PJLinkController = require('./pjlink-controller');

var p = new PJLinkController("172.16.3.77", 4352, "panasonic");

console.log(p.sendMessage("shutterOff"));
console.log(p.sendMessage("shutterStatus"));