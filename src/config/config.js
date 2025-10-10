// src/config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  smsProviderApiKey: process.env.SMS_API_KEY || 'demo-key',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    voice: process.env.TWILIO_VOICE || 'alice',
    language: process.env.TWILIO_LANGUAGE || 'es-MX'
  }
};
