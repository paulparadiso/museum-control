const mongoose = require('mongoose');

const syncGroupSchema = mongoose.Schema({
    name: String,
    devices: []
}, { timestamps: true });

const SyncGroup = mongoose.model('SyncGroup', syncGroupSchema);

const add = (data) => {
    const s = new SyncGroup({
        name: data.name,
        devices: data.devices
    });
    s.save();
    console.log(s);
}

const getAll = async () => {
    const docs = await SyncGroup.find();
    return docs;
}

const find = async (data) => {
    const docs = await SyncGroup.find(data);
    return docs;
}

const findOne = async (data) => {
    const doc = await SyncGroup.findOne(data);
    return doc;
}

const update = async (data) => {
    const doc = await SyncGroup.findOne({_id: data.id});
    doc.name = data.name;
    doc.devices = data.devices;
    doc.save();
    return doc._id;
}

const deleteOne = async (data) => {
    await SyncGroup.deleteOne({_id: data.id});
}

module.exports = {
    add,
    getAll,
    find,
    findOne,
    update,
    deleteOne
}