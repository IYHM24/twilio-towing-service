// src/routes/twiml.routes.js
const express = require('express');
const router = express.Router();
const TwiMLController = require('../twiml/twiml.controller');

// Rutas principales del sistema IVR
router.get('/main-menu', TwiMLController.mainMenu);
router.post('/main-menu', TwiMLController.processMainMenu);

// Rutas para manejo de servicios
router.post('/service-request', TwiMLController.processServiceRequest);
router.post('/service-status', TwiMLController.checkServiceStatus);

// Rutas para emergencias
router.get('/emergency', TwiMLController.emergencyMenu);
router.post('/emergency', TwiMLController.emergencyMenu);

// Rutas para horarios
router.get('/business-hours', TwiMLController.checkBusinessHours);

// Ruta para mensajes personalizados
router.get('/custom', TwiMLController.customMessage);

// Rutas de compatibilidad (para URLs anteriores)
router.get('/twiml/:timestamp', (req, res) => {
  // Redirigir a mensaje personalizado o menú principal
  res.redirect('/twiml/main-menu');
});

module.exports = router;