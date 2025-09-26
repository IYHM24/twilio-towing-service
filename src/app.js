// src/app.js
const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

// Rutas
const smsRoutes = require('./routes/sms.routes');
const voiceRoutes = require('./routes/voice.routes');

app.use('/sms', smsRoutes);
app.use('/voice', voiceRoutes);

module.exports = app;
