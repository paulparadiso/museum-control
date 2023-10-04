require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const User = require('./model/user');

const app = express();

app.use(express.json());

app.post('/register', (req, res) => {

})

app.post('/login', (req, res) => {
    
})

module.exports = app;