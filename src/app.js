// src/app.js
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { helmet, cors } = require('./middlewares/security');
const { apiRateLimit } = require('./middlewares/rateLimiter');
const logger = require('./middlewares/logger');

// Middlewares de seguridad globales
app.use(helmet);              // Configuración de headers de seguridad
app.use(cors);                // Configuración de CORS
app.use(apiRateLimit);        // Rate limiting general
app.use(logger);              // Logging de peticiones

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
const smsRoutes = require('./routes/sms.routes');
const callRoutes = require('./routes/call.routes');
const twimlRoutes = require('./routes/twiml.routes');

app.use('/sms', smsRoutes);
app.use('/call', callRoutes);
app.use('/twiml', twimlRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

module.exports = app;
