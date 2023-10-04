const fs = require('fs-extra');
const http = require('http');
const busboy = require('connect-busboy');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const meter = require('stream-meter');
const mongoose = require('mongoose');
const mqtt = require('mqtt');

module.exports = async () => {

    const app = express();

    //const mqttHost = '172.16.2.35';
    const mqttHost = 'localhost';
    const mqttPort = '1883';
    const mqttClientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const mqttUrl = `mqtt://${mqttHost}:${mqttPort}`

    const mqttClient = mqtt.connect(mqttUrl, {
        mqttClientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
    })

    mqttClient.on('connect', () => {
        console.log('Connected to mqtt broker.');
    })

    try {
        await mongoose.connect('mongodb://localhost:27017/srgm', {
            user: "admin",
            pass: "admin",
            authSource: "admin",
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch (err) {
        console.log(err);
    }

    const mediaSchema = new mongoose.Schema({
        name: String,
        path: String,
        size: Number,
        tags: [{ type: String }],
    }, { timestamps: true });

    const Media = mongoose.model('Media', mediaSchema);

    const playlistSchema = new mongoose.Schema({
        name: String,
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
    }, { timestamps: true });

    const Playlist = mongoose.model('Playlist', playlistSchema);

    const contentSchema = new mongoose.Schema({
        name: String,
        playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
    }, { timestamps: true })

    const Content = mongoose.model('Content', contentSchema);

    const deviceSchema = new mongoose.Schema({
        name: String,
        hostname: String,
        MAC: String,
        IP: String,
        content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
    }, { timestamps: true });

    const Device = mongoose.model('Device', deviceSchema);

    const syncGroupSchema = new mongoose.Schema({
        name: String,
        devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
    })

    const SyncGroup = mongoose.model('SyncGroup', syncGroupSchema);

    const uploadPath = path.join(__dirname, 'fu/');
    fs.ensureDir(uploadPath);

    app.use(express.json());

    app.use(busboy({
        highWaterMark: 2 * 1024 * 1024
    }));

    app.use(cors({
        origin: '*'
    }))

    app.use(bodyParser.urlencoded({ extended: true }));

    const getDeviceSyncGroups = async id => {
        let deviceSyncGroups = [];
        const syncGroups = await SyncGroup.find();
        syncGroups.forEach(sg => {
            sg.devices.forEach(d => {
                if (d._id.equals(id)) {
                    deviceSyncGroups.push(sg.name);
                }
            });
        });
        return deviceSyncGroups;
    }

    const createDevice = async params => {
        const filter = { MAC: params.mac };
        const update = { MAC: params.mac, IP: params.ip, hostname: params.hostname }
        const doc = await Device.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });
        let device = doc.toObject();
        device.syncGroups = await getDeviceSyncGroups(doc._id);
        console.log(device);
        return device;
    }

    const updateDevice = async params => {
        const filter = { _id: params.data.id };
        let doc = await Device.findOne(filter);
        for (const [key, value] of Object.entries(params.data)) {
            if (key.includes('id')) {
                continue;
            } else {
                doc[key] = value;
            }
        }
        doc.save();
        mqttClient.publish("museum/devices/update", JSON.stringify({ "device": params.data.id }));
        return { 'status': 'success' };
    }

    const deleteDevice = async params => {
        await Device.deleteOne({ _id: params.id });
        return { 'status': 'success' };
    }

    app.route('/device/:id?').get(async (req, res) => {
        let response;
        if (!req.params.id) {
            let devices = await Device.find();
            let devicesObj = []
            for (const d of devices) {
                let td = d.toObject();
                td.syncGroups = await getDeviceSyncGroups(d._id);
                devicesObj.push(td);
            };
            response = devicesObj;
        } else {
            response = await Device.findById(req.params.id);
            response = response.toObject();
            response.syncGroups = await getDeviceSyncGroups(response._id);
        }
        res.json(response);
    })

    app.route('/device/:action?').post(async (req, res) => {
        let responseData = {};
        switch (req.params.action) {
            case "create":
                responseData = await createDevice(req.body);
                break;
            case "update":
                responseData = await updateDevice(req.body);
                break;
            case "delete":
                responseData = await deleteDevice(req.body);
                break;
            default:
                break;
        }
        res.json(responseData);
    })

    const createPlaylist = async params => {
        const playlist = new Playlist({
            name: params.data.name,
        });
        params.data.items.forEach(i => {
            playlist.items.push(i);
        });
        playlist.save();
    }

    const updatePlaylist = async params => {
        const playlist = await Playlist.findById(params.id);
        playlist.items = [];
        params.items.forEach(i => {
            playlist.items.push(i);
        });
        playlist.save();
    }

    const deletePlaylist = async params => {
        await Playlist.deleteOne({ _id: params.data.id });
        return { 'status': 'success' };
    }

    app.route('/playlist/:id?').get(async (req, res) => {
        let playlists;
        if (!req.params.id) {
            playlists = await Playlist.find();
        } else {
            playlists = await Playlist.findById(req.params.id);
        }
        res.json({ 'playlists': playlists });
    })

    app.route('/playlist/:action?').post(async (req, res) => {
        switch (req.params.action) {
            case "create":
                createPlaylist(req.body);
                break;
            case "update":
                updatePlaylist(req.body);
                break;
            case "delete":
                deletePlaylist(req.body);
            default:
                break
        }
        res.json({ 'status': 'success' });
    });

    const createContent = async params => {
        const content = new Content({
            name: params.data.name,
            playlists: params.data.playlists
        });
        content.save();
    }

    const updateContent = async params => {
        const content = await Content.findById(params.data.id);
        content.playlists = [];
        params.data.playlists.forEach(i => {
            content.playlists.push(i);
        });
        content.save();
        let modifiedDeviceIds = [];
        let devices = await Device.find();
        devices.forEach(d => {
            if (d.content.equals(params.data.id)) {
                console.log(d._id);
                modifiedDeviceIds.push(d._id);
            }
        });
        modifiedDeviceIds.forEach(id => {
            mqttClient.publish("museum/devices/update", JSON.stringify({ "device": id }));
        });
    }

    const deleteContent = async params => {
        await Content.deleteOne({ _id: params.data.id });
        return { 'status': 'success' };
    }

    app.route('/content/:id?').get(async (req, res) => {
        let content;
        if (!req.params.id) {
            content = await Content.find().populate({
                path: "playlists",
                populate: {
                    path: 'items',
                    model: 'Media'
                }
            });
        } else {
            content = await Content.findById(req.params.id).populate({
                path: "playlists",
                populate: {
                    path: 'items',
                    model: 'Media'
                }
            });
        }
        res.json({ 'content': content });
    });

    app.route('/content/:action?').post(async (req, res) => {
        switch (req.params.action) {
            case "create":
                createContent(req.body);
                break;
            case "update":
                updateContent(req.body);
                break;
            case "delete":
                deleteContent(req.body);
            default:
                break
        }
        res.json({ 'status': 'success' });
    });


    app.route('/media/:id?').get(async (req, res) => {
        let mediaFiles;
        if (!req.params.id) {
            mediaFiles = await Media.find();
        } else {
            mediaFiles = await Media.findById(req.params.id);
        }
        res.json({ 'files': mediaFiles });
    });

    const updateMedia = async params => {
        let m = await Media.findById(params.id);
        m.tags = params.tags;
        m.save();
    }

    const deleteMedia = params => {

    }

    app.route('/media/:action?').post(async (req, res) => {
        switch (req.params.action) {
            case "update":
                updateMedia(req.body);
                break;
            case "delete":
                deleteMedia(req.body);
            default:
                break
        }
        res.json({ 'status': 'success' });
    });

    const createSyncGroup = async params => {
        const syncGroup = new SyncGroup({
            name: params.data.name,
        });
        params.data.devices.forEach(i => {
            syncGroup.devices.push(i);
        });
        syncGroup.save();
        syncGroup.devices.forEach(id => {
            mqttClient.publish("museum/devices/update", JSON.stringify({ "device": id }));
        });
    }

    const updateSyncGroup = async params => {
        const syncGroup = await SyncGroup.findById(params.id);
        syncGroup.devices = [];
        params.devices.forEach(i => {
            syncGroup.devices.push(i);
        });
        syncGroup.save();
        syncGroup.devices.forEach(id => {
            mqttClient.publish("museum/devices/update", JSON.stringify({ "device": id }));
        });
    }

    const deleteSyncGroup = async params => {
        await SyncGroup.deleteOne({ _id: params.data.id });
        return { 'status': 'success' };
    }

    app.route('/syncGroup/:id?').get(async (req, res) => {
        let syncGroup;
        if (!req.params.id) {
            syncGroup = await Playlist.find();
        } else {
            syncGroup = await Playlist.findById(req.params.id);
        }
        res.json({ 'syncGroup': syncGroup });
    })

    app.route('/syncGroup/:action?').post(async (req, res) => {
        switch (req.params.action) {
            case "create":
                createSyncGroup(req.body);
                break;
            case "update":
                updateSyncGroup(req.body);
                break;
            case "delete":
                deleteSyncGroup(req.body);
            default:
                break
        }
        res.json({ 'status': 'success' });
    });

    app.route('/everything').get(async (req, res) => {
        let devices, mediaFiles, playlists, contents;
        let devicesObj = [];
        devices = await Device.find().sort('hostname');
        devices.forEach(async d => {
            let td = d.toObject();
            let dsg = await getDeviceSyncGroups(d._id);
            td.syncGroups = dsg;
            devicesObj.push(td);
        })
        mediaFiles = await Media.find();
        playlists = await Playlist.find();
        contents = await Content.find();
        syncGroups = await SyncGroup.find();
        res.json({ 'devices': devicesObj, 'media': mediaFiles, 'playlists': playlists, 'contents': contents, 'syncGroups': syncGroups });
    })

    app.route('/upload').post((req, res, next) => {
        req.pipe(req.busboy);
        req.busboy.on('file', (fieldname, file, info) => {
            const { filename, encoding, mimeType } = info;
            let m = meter();
            console.log(`Upload of '${filename}' started.`);
            const fstream = fs.createWriteStream(path.join(uploadPath, filename));
            file.pipe(m).pipe(fstream);

            fstream.on('close', () => {
                const mediaData = new Media({
                    name: filename,
                    path: path.join(uploadPath, filename),
                    size: m.bytes,
                    tags: []
                });
                mediaData.save();
                console.log(`Upload of '${filename}' finished.`);
                res.end(JSON.stringify({ 'status': 'success' }));
            });
        });
    });

    app.route('/download/:id').get(async (req, res) => {
        const m = await Media.findById(req.params.id);
        res.sendFile(m.path);
    })

    app.route('/uploadjson').post((req, res) => {
        console.log(req.body);
        const filename = req.body.name;
        console.log(`Upload of '${filename}' started.`);
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        file.pipe(fstream);

        fstream.on('data', chunk => {
            console.log(chunk.length);
        });

        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished.`);
            res.redirect('back');
        });
        res.send(req.body);
    })

    app.route('/upload').get((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="upload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="fileToUpload"><br/>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    });

    app.route('/syncplayers').post((res, req) => {
        mqttClient.publish("museum/players", "play");
    })

    const server = app.listen(3005, () => {
        console.log(`Media server listening on port ${server.address().port}`);
    });

}