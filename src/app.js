// src/app.js
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Middlewares
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
const smsRoutes = require('./routes/sms.routes');
//const voiceRoutes = require('./routes/voice.routes');

app.use('/sms', smsRoutes);
//app.use('/voice', voiceRoutes);

module.exports = app;
