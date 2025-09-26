// src/services/outgoing.call.service.js
const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

// Función principal para realizar llamadas
const makeCall = async (to, twimlUrl, options = {}) => {
  try {
    const callOptions = {
      to,
      from: config.twilio.phoneNumber,
      url: twimlUrl,
      timeout: options.timeout || 60, // 60 segundos por defecto
      record: options.record || false,
      statusCallback: options.statusCallback,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      ...options
    };

    const call = await client.calls.create(callOptions);
    
    return {
      success: true,
      callSid: call.sid,
      status: call.status,
      to: call.to,
      from: call.from,
      direction: call.direction,
      dateCreated: call.dateCreated
    };
  } catch (error) {
    console.error('Error realizando la llamada:', error);
    
    // Manejo específico de errores de llamadas
    let errorMessage = error.message;
    
    if (error.code === 21408) {
      errorMessage = `Permisos no habilitados para realizar llamadas a ${to}. Habilita los permisos geográficos en tu consola de Twilio.`;
    } else if (error.code === 21211) {
      errorMessage = `Número de teléfono inválido: ${to}`;
    } else if (error.code === 21217) {
      errorMessage = `Número de teléfono no válido para llamadas: ${to}`;
    } else if (error.code === 20003) {
      errorMessage = 'Credenciales de Twilio inválidas. Verifica tu Account SID y Auth Token.';
    } else if (error.code === 21218) {
      errorMessage = 'URL de TwiML inválida o inaccesible.';
    } else if (error.code === 21219) {
      errorMessage = 'Número de origen no válido o no verificado.';
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
      moreInfo: error.moreInfo
    };
  }
};

// Función para obtener el estado de una llamada
const getCallStatus = async (callSid) => {
  try {
    const call = await client.calls(callSid).fetch();
    return {
      success: true,
      callSid: call.sid,
      status: call.status,
      duration: call.duration,
      price: call.price,
      priceUnit: call.priceUnit,
      direction: call.direction,
      answeredBy: call.answeredBy,
      dateCreated: call.dateCreated,
      dateUpdated: call.dateUpdated,
      startTime: call.startTime,
      endTime: call.endTime
    };
  } catch (error) {
    console.error('Error obteniendo estado de llamada:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Función para colgar una llamada
const hangupCall = async (callSid) => {
  try {
    const call = await client.calls(callSid).update({ status: 'completed' });
    return {
      success: true,
      callSid: call.sid,
      status: call.status,
      message: 'Llamada terminada exitosamente'
    };
  } catch (error) {
    console.error('Error terminando llamada:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Función para obtener URL de TwiML basada en el tipo de llamada
const getTwiMLUrl = (baseUrl, callType = 'main-menu', params = {}) => {
  let url = `${baseUrl}/twiml/${callType}`;
  
  // Añadir parámetros si existen
  const searchParams = new URLSearchParams(params);
  if (searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

module.exports = {
  makeCall,
  getCallStatus,
  hangupCall,
  getTwiMLUrl
};