// src/controllers/call.controller.js
const { 
  makeCall, 
  getCallStatus, 
  hangupCall, 
  getTwiMLUrl 
} = require('../services/outgoing.call.service');

// Controlador para realizar una llamada
const makeCallController = async (req, res) => {
  try {
    const { to, callType = 'main-menu', message, options = {} } = req.body;
    
    // Validación básica
    if (!to) {
      return res.status(400).json({ 
        success: false, 
        error: 'El campo "to" es requerido' 
      });
    }
    
    // Construir URL base del servidor
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    let twimlUrl = '';
    
    // Determinar el tipo de TwiML a usar
    switch (callType) {
      case 'custom':
        if (!message) {
          return res.status(400).json({ 
            success: false, 
            error: 'El campo "message" es requerido para llamadas personalizadas' 
          });
        }
        twimlUrl = getTwiMLUrl(baseUrl, 'custom', { 
          message, 
          voice: options.voice, 
          language: options.language 
        });
        break;
      case 'main-menu':
      case 'emergency':
      case 'business-hours':
        twimlUrl = getTwiMLUrl(baseUrl, callType);
        break;
      default:
        twimlUrl = getTwiMLUrl(baseUrl, 'main-menu');
    }
    
    // Realizar la llamada
    const result = await makeCall(to, twimlUrl, options);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Llamada iniciada exitosamente',
        callSid: result.callSid,
        status: result.status,
        to: result.to,
        from: result.from,
        twimlUrl,
        callType
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: result.error,
        code: result.code
      });
    }
  } catch (error) {
    console.error('Error en controlador de llamadas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Controlador para obtener el estado de una llamada
const getCallStatusController = async (req, res) => {
  try {
    const { callSid } = req.params;
    
    if (!callSid) {
      return res.status(400).json({ 
        success: false, 
        error: 'callSid es requerido' 
      });
    }
    
    const result = await getCallStatus(callSid);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error obteniendo estado de llamada:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Controlador para terminar una llamada
const hangupCallController = async (req, res) => {
  try {
    const { callSid } = req.params;
    
    if (!callSid) {
      return res.status(400).json({ 
        success: false, 
        error: 'callSid es requerido' 
      });
    }
    
    const result = await hangupCall(callSid);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error terminando llamada:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Este controlador ahora está obsoleto - usar TwiMLController en su lugar

// Controlador para manejar webhooks de estado de llamada
const callStatusWebhook = (req, res) => {
  try {
    const { CallSid, CallStatus, Duration, AnsweredBy } = req.body;
    
    console.log(`📞 Webhook de llamada - SID: ${CallSid}, Estado: ${CallStatus}`);
    
    // Aquí puedes agregar lógica personalizada según el estado
    switch (CallStatus) {
      case 'ringing':
        console.log(`📱 Llamada ${CallSid} está sonando...`);
        break;
      case 'answered':
        console.log(`✅ Llamada ${CallSid} fue contestada`);
        break;
      case 'completed':
        console.log(`🏁 Llamada ${CallSid} terminó. Duración: ${Duration} segundos`);
        break;
      case 'busy':
        console.log(`📵 Llamada ${CallSid} - línea ocupada`);
        break;
      case 'no-answer':
        console.log(`📴 Llamada ${CallSid} - no contestaron`);
        break;
      case 'failed':
        console.log(`❌ Llamada ${CallSid} falló`);
        break;
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error en webhook de estado:', error);
    res.status(500).send('Error');
  }
};

module.exports = {
  makeCallController,
  getCallStatusController,
  hangupCallController,
  callStatusWebhook
};