// src/services/sms.service.js
const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

const sendSms = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to
    });
    return { 
      success: true, 
      sid: response.sid,
      status: response.status,
      to: response.to,
      from: response.from
    };
  } catch (error) {
    console.error('Error enviando SMS:', error);
    
    // Manejo específico de errores comunes
    let errorMessage = error.message;
    
    //
    if (error.code === 21408) {
      errorMessage = `Permisos no habilitados para enviar SMS a ${to}. Habilita los permisos geográficos en tu consola de Twilio.`;
    } else if (error.code === 21211) {
      errorMessage = `Número de teléfono inválido: ${to}`;
    } else if (error.code === 21614) {
      errorMessage = `Número de teléfono no válido o no puede recibir SMS: ${to}`;
    } else if (error.code === 20003) {
      errorMessage = 'Credenciales de Twilio inválidas. Verifica tu Account SID y Auth Token.';
    }
    
    //
    return { 
      success: false, 
      error: errorMessage,
      code: error.code,
      moreInfo: error.moreInfo
    };

  }
};

module.exports = { sendSms };
