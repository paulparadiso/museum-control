const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    name: String,
    ip: String,
    mac: String,
    type: String,
    zone: String,
    location: String,
    tags: [],
    details: {}
}, { timestamps: true });

const Device = mongoose.model('Device', deviceSchema);

const add = async (data) => {
    console.log(`Adding ${data.mac} to devices.`);
    let d = await Device.findOne({mac: data.mac});
    console.log(d);
    console.log(data);
    if(d === null) {
        d = new Device({
            name: data.name,
            ip: data.ip,
            mac: data.mac,
            type: data.type,
            details: data.details
        });
    } else {
        console.log('Device already exists.')
    }
    console.log(d);
    d.save();
    return d._id.toString();
}

const getAll = async () => {
    const docs = await Device.find();
    return docs;
}

const find = async (data) => {
    const docs = await Device.find(data);
    return docs;
}

const findOne = async (data) => {
    const doc = await Device.findOne(data);
    return doc;
}

const update = async(data) => {
    const doc = await Device.findOne({_id: data._id});
    doc.zone = data.zone;
    doc.location = data.location;
    doc.name = data.name;
    doc.type = data.type;
    doc.details = {
        ...doc.details,
        ...data.details
    }
    doc.save();
    return doc._id;
}

module.exports = {
    add,
    getAll,
    find,
    findOne,
    update
}