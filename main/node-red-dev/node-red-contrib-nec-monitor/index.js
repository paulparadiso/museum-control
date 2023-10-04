const TCPDevice = require('../lib/tcp/tcp');

let monitor = new TCPDevice('nec', '172.16.3.96');

monitor.sendMessage("powerStatus");