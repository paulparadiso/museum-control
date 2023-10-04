const net = require('net');
const PandorasBoxTCP = require('./PandorasBoxTCP');

module.exports = function(RED) {

    function PandorasBox(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        const pandorasBoxTCP = new PandorasBoxTCP(config.ip, config.fullscreenid, config.windowedid);
        pandorasBoxTCP.send = m => {
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
            pandorasBoxTCP.sendMessage(cmd);
        });
    }   

    RED.nodes.registerType('pandoras-box', PandorasBox);

}