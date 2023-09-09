require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const constants = require('./config/constants');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

require('./config/database');

const swaggerDocument = require('./swagger.json');

swaggerDocument.host = 'localhost:5001';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const indexRoute = require('./v1/routes/index.route');

const PORT = process.env.PORT || constants.PORT;

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

//Parse Form Data
app.use(express.urlencoded({ extended: true }));

app.use('/v1', indexRoute);

app.listen(PORT, () => console.log('Server running on port... ', PORT));