// src/routes/sms.routes.js
const express = require('express');
const router = express.Router();
const smsController = require('../controllers/sms.controller');
const apiKeyAuth = require('../middlewares/apikey');

// Ejemplo de endpoint SMS
router.post('/send', apiKeyAuth, smsController.sendSms);

module.exports = router;
