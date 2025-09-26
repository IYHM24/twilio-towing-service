// src/middlewares/security.js
const helmet = require('helmet');
const cors = require('cors');

// Configuración de CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: false
};

// Middleware de validación de número de teléfono
const validatePhoneNumber = (req, res, next) => {
  const { to } = req.body;
  
  if (!to) {
    return res.status(400).json({
      success: false,
      error: 'El número de teléfono es requerido'
    });
  }
  
  // Validación básica de formato de teléfono (E.164)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(to)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de número de teléfono inválido. Use formato E.164 (+1234567890)'
    });
  }
  
  next();
};

// Middleware de validación de mensaje
const validateMessage = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'El mensaje es requerido y debe ser una cadena de texto'
    });
  }
  
  if (message.length > 1600) {
    return res.status(400).json({
      success: false,
      error: 'El mensaje no puede exceder 1600 caracteres'
    });
  }
  
  if (message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'El mensaje no puede estar vacío'
    });
  }
  
  next();
};

module.exports = {
  helmet: helmet(),
  cors: cors(corsOptions),
  validatePhoneNumber,
  validateMessage
};