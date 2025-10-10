// src/routes/twiml.routes.js
const express = require('express');
const router = express.Router();
const TwiMLController = require('../twiml/twiml.controller');

// Rutas principales del sistema IVR
router.get('/main-menu', TwiMLController.mainMenu);
router.post('/main-menu', TwiMLController.processMainMenu);
router.post('/sub-menu/tow', TwiMLController.TowMenu);
router.post('/sub-menu/tow/lift/retry/:idRetry', TwiMLController.retryLiftResponse);
router.post('/sub-menu/tow/lift/response/:idResponse', TwiMLController.processLiftResponses);
router.post('/hello', TwiMLController.welcomeMessage);

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

// Rutas para captura de respuestas
router.get('/capture-client-info', TwiMLController.captureClientInfo);
router.post('/process-client-info', TwiMLController.processClientInfo);
router.get('/capture-service-type', TwiMLController.captureServiceType);
router.post('/process-service-type', TwiMLController.processServiceType);
router.get('/capture-pickup-location', TwiMLController.capturePickupLocation);
router.post('/process-pickup-location', TwiMLController.processPickupLocation);

// Ruta genérica para procesar respuestas
router.post('/process-response', (req, res) => {
  // Esta ruta puede ser usada como action por defecto
  console.log('Respuesta genérica recibida:', req.body);
  const TwiMLGenerator = require('../twiml/twiml.generator');
  const twiml = TwiMLGenerator.generateSimpleMessage('Respuesta recibida. Gracias.');
  res.set('Content-Type', 'text/xml');
  res.send(twiml);
});

// Rutas de compatibilidad (para URLs anteriores)
router.get('/twiml/:timestamp', (req, res) => {
  // Redirigir a mensaje personalizado o menú principal
  res.redirect('/twiml/main-menu');
});

module.exports = router;