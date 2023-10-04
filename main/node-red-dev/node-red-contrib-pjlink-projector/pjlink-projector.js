const pjlink = require('./pjlink-controller');

module.exports = function(RED) {

    function PJLinkProjector(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const projector = new pjlink(config.ip, config.port, config.password);
        projector.send = m => {
            if(m.message === "ERROR") {
                node.warn(m.value);
            } else {
                msg = {},
                msg.payload = m;
                node.send(msg);
            }
        }
        node.on("input", function(msg) {
            var cmd = msg.payload;
            projector.sendMessage(cmd);
        });
    }
    RED.nodes.registerType('pjlink-projector', PJLinkProjector);
}