// src/services/sms.service.js
const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

async function sendSms(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to
    });
    return { success: true, sid: response.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { sendSms };
