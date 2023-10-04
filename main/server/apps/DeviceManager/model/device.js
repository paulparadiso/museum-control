const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
    name: String,
    MAC: String,
    IP: String,
    tags: [{ type: String }]
});

module.exports = mongoose.model(DeviceSchema);