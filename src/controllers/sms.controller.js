// src/controllers/sms.controller.js
const { sendSms } = require('../services/sms.service');

const sendSmsController = async (req, res) => {
  try {
    const { to, message } = req.body;
    
    // Las validaciones se manejan en los middlewares
    
    // Enviar SMS usando el servicio de Twilio
    const result = await sendSms(to, message);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'SMS enviado exitosamente',
        sid: result.sid,
        status: result.status,
        to: result.to,
        from: result.from
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.error,
        code: result.code
      });
    }
  } catch (error) {
    console.error('Error en controlador de SMS:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = { sendSms: sendSmsController };
