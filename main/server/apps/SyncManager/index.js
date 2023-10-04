const MongoManager = require('../Server/db/mongomanager');
const mqtt = require('mqtt');

const SYNC_TOPIC = "/museum/control/sync";

module.exports = () => {
    mqttClient = mqtt.connect(process.env.MQTT_BROKER);
    const mongoManager = new MongoManager();
    mongoManager.connect(process.env.MONGO_DB_URL, collection='srgm', process.env.MONGO_DB_USER, process.env.MONGO_DB_PASSWORD);

    const processMessage = async (topic, message) => {
        const syncGroup = await mongoManager.readDocument('syncGroup', {name: message});
        console.log(syncGroup);
        syncGroup.devices.forEach(d => {
            console.log(`Sending message to ${d}`)
            mqttClient.publish(`/museum/players/${d}`, 'play')
        })
    }

    const configureMQTT = () => {
        mqttClient.on('connect', () => {
            mqttClient.subscribe(SYNC_TOPIC);
        });
        mqttClient.on("message", (topic, message) => { 
            processMessage(topic, message);
        });
    }

    const init = () => {
        configureMQTT();
    }

    init();
}