require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const constants = require('./config/constants');
const path = require('path');

require('./config/database');

const indexRoute = require('./v1/routes/index.route');

const PORT = process.env.PORT || constants.PORT;

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

//Parse Form Data
app.use(express.urlencoded({ extended: true }));

app.use('/v1', indexRoute);

app.listen(PORT, () => console.log('Server running on port... ', PORT));