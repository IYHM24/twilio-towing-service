// src/routes/call.routes.js
const express = require('express');
const router = express.Router();
const {
  makeCallController,
  getCallStatusController,
  hangupCallController,
  callStatusWebhook
} = require('../controllers/call.controller');
const apiKeyAuth = require('../middlewares/apikey');
const { smsRateLimit } = require('../middlewares/rateLimiter');
const { validatePhoneNumber } = require('../middlewares/security');

// Middleware específico para validar mensajes de llamada
const validateCallMessage = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'El mensaje es requerido y debe ser una cadena de texto'
    });
  }
  
  if (message.length > 4000) {
    return res.status(400).json({
      success: false,
      error: 'El mensaje no puede exceder 4000 caracteres para llamadas'
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

// Rutas protegidas con autenticación
router.post('/make', 
  smsRateLimit,           // Rate limiting
  apiKeyAuth,             // Autenticación por API key
  validatePhoneNumber,    // Validación de número de teléfono
  validateCallMessage,    // Validación de mensaje
  makeCallController      // Controlador
);

router.get('/status/:callSid', 
  apiKeyAuth,             // Autenticación por API key
  getCallStatusController // Controlador
);

router.post('/hangup/:callSid', 
  apiKeyAuth,             // Autenticación por API key
  hangupCallController    // Controlador
);

// Rutas públicas para webhooks (sin autenticación)
router.post('/status-webhook', callStatusWebhook);

module.exports = router;