const TCPDevice = require("../lib/tcp/tcp");

module.exports = function(RED) {

    function NECMonitor(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const monitor = new TCPDevice('nec', config.ip);
        monitor.send = m => {
            if(m.message === "ERROR") {
                node.warn(m.value);
            } else {
                msg = {}
                msg.payload = m;
                node.send(msg);
            }
        }
        node.on("input", function(msg) {
            var cmd = msg.payload;
            var args = msg.payload.args || null
            monitor.sendMessage(cmd, args);
        });
    }
    RED.nodes.registerType('nec-monitor', NECMonitor);
}