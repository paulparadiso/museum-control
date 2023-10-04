const TCPDevice = require("../lib/tcp/tcp");

module.exports = function(RED) {

    function ChristieProjector(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const projector = new TCPDevice('christie', config.ip);
        projector.send = m => {
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
            projector.sendMessage(cmd, args);
        });
    }
    RED.nodes.registerType('christie-projector', ChristieProjector);
}