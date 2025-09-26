// src/routes/sms.routes.js
const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');
const apiKeyAuth = require('../middlewares/apikey');
const { smsRateLimit } = require('../middlewares/rateLimiter');
const { validatePhoneNumber, validateMessage } = require('../middlewares/security');

// Endpoint para enviar SMS con múltiples capas de seguridad
router.post('/send', 
  smsRateLimit,           // Rate limiting específico para SMS
  apiKeyAuth,             // Autenticación por API key
  validatePhoneNumber,    // Validación de número de teléfono
  validateMessage,        // Validación de mensaje
  smsController.sendSms   // Controlador
);

module.exports = router;
