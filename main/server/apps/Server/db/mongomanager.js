const mediaSchema = require('./models/Media/Media');
const mongoose = require('mongoose');
const Media = require('./models/Media/Media');
const Device = require('./models/Device/Device');
const SyncGroup = require('./models/SyncGroup/SyncGroup')

const docTypes = {
    'media': Media,
    'device': Device,
    'syncGroup': SyncGroup
}

class MongoManager {

    constructor() {
        this.uri = null;
        this.db = null;
        this.connectionStatus = false;
    }

    createModels() {
        this.Media = this.db.model('Media', Media);
    }

    async connect(uri, collection = null, user = null, pass = null) {
        const tokens = uri.split(':');
        try {
            await mongoose.connect(`${uri}/${collection}`, {
                user: `${user}`,
                pass: `${pass}`,
                authSource: `${user}`,
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log(`Connected to mongodb - ${uri}`)
                this.connectionStatus = true;
            })
        } catch (err) {
            console.log(err);
        }   
    }


    connectionStatus() {
        return this.connectionStatus;
    }

    async createDocument(docType, data) {
        console.log(`MongoManager adding`);
        console.log(data);
        console.log(`to ${docType}`)
        const id = docTypes[docType].add(data);
        return id;
    }

    readDocument(docType, data) {
        const doc = docTypes[docType].findOne(data)
        return doc;
    }

    readDocuments(docType) {
        const docs = docTypes[docType].getAll();
        return docs;
    }

    async getAllDocuments(docType) {
        docs = {}
        Object.keys(docType).forEach(async dt => {
            docs[dt] = await docTypes[dt].find();
        })
        return docs;
    }

    updateDocument(docType, data) {
        return docTypes[docType].update(data);
    }

    deleteDocument(docType, data) {
        console.log(data);
        return docTypes[docType].deleteOne(data);
    }

    async makePlaylist(id) {
        const device = await docTypes['device'].findOne({_id:id});
        if(device === undefined) {
            return {}
        }
        let playlist = {}
        if(device && device.details && device.details.content1 && device.details.content1 !== 'None') {
            const media = await docTypes['media'].findOne({_id:device.details.content1});
            playlist[0] = {
                id: media._id.toString(),
                filename: media.name
            }

        }
        if(device && device.details && device.details.content2 && device.details.content2 !== 'None') {
            const media = await docTypes['media'].findOne({_id: device.details.content2});
            playlist[1] = {
                id: media._id.toString(),
                filename: media.name
            }
        }
        console.log(playlist);
        return playlist;
    }
}

module.exports = MongoManager;