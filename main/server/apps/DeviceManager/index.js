const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

module.exports = async () => {
    
    const app = express();

    try {
        await mongoose.connect('mongodb://admin:admin@mongo:27017/devices')
    } catch (err) {
        console.log(err);
    }

}