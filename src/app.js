const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require("mongoose");


const { PORT, MONGO } = process.env;

const logger = require('./logger');
const { userRoutes, accountRoutes, deviceRoutes } = require('./routes');
const { apiMiddleWare, userMiddleWare, hardwareMiddleWare } = require('./middlewares/api_middleware');
const { authRoutes } = require('./utils/constants');


const app = express();

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json({ extended: false }));
// Request + Response logger middleware
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        if (req.method === "OPTIONS") return;
        const duration = Date.now() - start;
        const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - ${req.method === "GET" ? `params: ${JSON.stringify(req.params)}` : `body: ${JSON.stringify(req.body)}`} ${req.user ? `- user: ${req.user.mobile}` : ""}`;
        logger.info(logMessage);
    });

    next();
});
app.use(apiMiddleWare);
// app.use(authRoutes, userMiddleWare);

app.use('/api/accounts', accountRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use((req, res) => res.sendResponse('api not found', 404));

app.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`);
    await mongoose.connect(MONGO);
    console.log('connected to database');
})