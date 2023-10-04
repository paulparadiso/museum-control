const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
    name: String,
    path: String,
    type: {type: String},
    notes: String,
    tags: [{ type: String }],
    size: Number,
    metadata: {}
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

const add = (filedata) => {
    const m = new Media({
        name: filedata.name,
        path: filedata.path,
        type: filedata.type,
        size: filedata.size,
        tags: filedata.tags || null,
        metadata: filedata.metadata || null
    });
    m.save();
    console.log(m);
}

const getAll = async () => {
    const docs = await Media.find();
    return docs;
}

const find = async (data) => {
    const docs = await Media.find(data);
    return docs;
}

const findOne = async (data) => {
    const doc = await Media.findOne(data);
    return doc;
}

const deleteOne = async (data) => {
    console.log(data);
    await Media.deleteOne({_id: data});
}

module.exports = {
    add,
    getAll,
    find,
    findOne,
    deleteOne
}