const fs = require('fs-extra');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const busboy = require('connect-busboy');
const meter = require('stream-meter');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
const mqtt = require('mqtt');
const ConfigManager = require('./utils/Config');
const MongoManager = require('./db/mongomanager');
const mime = require('mime');
require('dotenv').config({path: path.resolve(__dirname, '../../dashboard', '.env')});

//const MUSEUM_BROKER = `mqtt://localhost:1883`;
const MUSEUM_BROKER = process.env.MQTT_BROKER;

module.exports = async () => {

    console.log(process.env);

    const mqttClient = mqtt.connect(MUSEUM_BROKER);
    const MQTTMessageStore = {};
    let currentUser = 'all';

    const configManager = new ConfigManager();

    let dbConnected = false;
    let mqttConnected = false;

    let urlencodedParser = bodyParser.urlencoded({ extended: false });
    let jsonParser = bodyParser.json();

    mongoManager = new MongoManager();

    mongoManager.connect(process.env.MONGO_DB_URL, collection='srgm', process.env.MONGO_DB_USER, process.env.MONGO_DB_PASSWORD);

    const schema = buildSchema(`
        type Query {
            getMQTTMessage(topic: String): String
            getCurrentUser: String
        }
        type Mutation {
            sendMQTTMessage(topic: String!, message: String!): Boolean
        }
    `)

    const uploadPath = path.join(__dirname, 'fu/');
    fs.ensureDir(uploadPath);

    const root = {
        getMQTTMessage: ({ topic }) => {
            return MQTTMessageStore[topic];
        },
        getCurrentUser: () => {
            return currentUser;
        },
        sendMQTTMessage: ({ topic, message }) => {
            mqttClient.publish(topic, message);
            return true;
        }
    }

    const deleteMedia = async id => {
        const doc = await mongoManager.readDocument('media', id);
        if(doc !== null) {
            console.log(`Deleting ${doc.name} from ${doc.path}`);
            await fs.unlink(doc.path);
        } else {
            console.log('Delete media: document null.');
        }
    }

    const app = express(),
        port = 3333;

    app.use(cors({
        origin: '*'
    }))
    app.use(express.static(path.join(__dirname, '../../dashboard/dist')));
    app.use(express.json());
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    }));

    app.use(busboy({
        highWaterMark: 2 * 1024 * 1024
    }));

    app.get(['index.html', '/'], (req, res) => {
        //const auth = new Buffer.from(req.get('authorization').split(" ")[1], 'base64').toString();
        //currentUser = auth.split(':')[0];
        res.sendFile(path.join(__dirname, '../../dashboard/dist/index.html'));
    });

    app.get('/status', (req, res) => {
        res.json({dbConnected: dbConnected, mqttConnected: mqttConnected});
    })

    app.get('/config/:name?', async (req, res) => {
        if(req.params.name) {
            res.json(await configManager.getConfig(req.params.name));
        } else {
            res.json(await configManager.getAllConfigs());
        }
    })

    app.post('/device/create', async(req, res) => {
        console.log(req.body);
        const id = await mongoManager.createDocument('device', {
            'name': req.body.name,
            'type': req.body.type,
            'ip': req.body.ip,
            'mac': req.body.mac,
            'details': req.body.details
        })
        console.log(id);
        res.json({'status': 'success', 'id': id});
    });

    app.get('/playlist/:id', async (req, res) => {
        /*
        playlist = {
            0: {
                id: '64c2f0f2efcc2a1417196fc5',
                filename: 'wormhole.mp4'
            },
            1: {
                id: '64c2f0f2efcc2a1417196fc5',
                filename: 'wormhole.mp4'
            }
        }
        */
        const playlist = await mongoManager.makePlaylist(req.params.id);
        //console.log(playlist);
        res.json(playlist);
    })

    app.get('/media/:id', async (req, res) => {
        const m = await mongoManager.readDocument('media', {_id: req.params.id});
        res.sendFile(m.path);
    });

    app.post('/config', async (req, res) => {
        console.log(req.body)
        res.json(await configManager.saveConfig(req.body.name, req.body.data));
    });

    app.route('/upload').post((req, res, next) => {
        req.pipe(req.busboy);
        req.busboy.on('file', (fieldname, file, info) => {
            const { filename, encoding, mimeType } = info;
            let m = meter();
            console.log(`Upload of '${filename}' started.`);
            const fstream = fs.createWriteStream(path.join(uploadPath, filename));
            file.pipe(m).pipe(fstream);
    
            fstream.on('close', () => {
                console.log();
                mongoManager.createDocument('media', {
                    name: filename,
                    path: path.join(uploadPath, filename),
                    type: mime.getType(path.join(uploadPath, filename)),
                    size: m.bytes,
                    tags: [],
                    metadata: {}
                });
                console.log(`Upload of '${filename}' finished.`);
                res.end(JSON.stringify({ 'status': 'success' }));
            });
        });
    });

    app.post('/document/create', (req, res) => {
        mongoManager.createDocument(req.body.type, req.body.data);
        res.json({'status': 'success'})
    });

    app.post('/document/read', async (req, res) => {
        const doc = await mongoManager.readDocument(req.body.type, req.body.data);
        res.json({response: doc});
    });

    app.get('/document/read/:type', async (req, res) => {
        const docs = await mongoManager.readDocuments(req.params.type);
        res.json({response: docs});
    })

    app.post('/document/update', async (req, res) => {
        const r = await mongoManager.updateDocument(req.body.type, req.body.data);
        if(req.body.type === 'device') {
            console.log(`sending load message to ${req.body.data.name}`);
            mqttClient.publish(`/museum/players/${req.body.data.name}`, "load");
        }
        res.json({response: {'status': 'ok', 'id': r}});
    });

    app.post('/document/delete', async (req, res) => {
        console.log(req.body);
        if(req.body.type === 'media') {
            deleteMedia(req.body.data);
        }
        const r = await mongoManager.deleteDocument(req.body.type, req.body.id);
        console.log(r);
        res.json({response: r});
    });

    mqttClient.on('connect', () => {
        console.log('Connected to mosquitto.');
        mqttClient.subscribe('#');
    });
    
    mqttClient.on('message', (topic, message) => {
        MQTTMessageStore[topic] = message.toString();
    });
    
    app.listen(port, () => {
        console.log(`listening on ${port}`);
    });
}