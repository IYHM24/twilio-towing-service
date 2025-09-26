// src/routes/sms.routes.js
const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');

// Ejemplo de endpoint SMS
router.post('/send', smsController.sendSms);

module.exports = router;
