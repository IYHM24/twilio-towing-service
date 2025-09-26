// src/controllers/sms.controller.js
const { sendSms } = require('../services/sms.service');

exports.sendSms = async (req, res) => {
  try {
    const { to, message } = req.body;
    
    // Validación básica
    //if (!to || !message) {
    //  return res.status(400).json({ 
    //    success: false, 
    //    error: 'Los campos "to" y "message" son requeridos' 
    //  });
    //}
    
    // Enviar SMS usando el servicio de Twilio
    const result = await sendSms(to, message);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'SMS enviado exitosamente',
        sid: result.sid,
        to,
        body: message
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};
