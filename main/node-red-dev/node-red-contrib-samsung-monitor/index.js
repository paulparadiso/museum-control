const TCPDevice = require('../lib/tcp/tcp');

let monitor = new TCPDevice('samsung', '172.16.0.112');

monitor.sendMessage("powerStatus");