// src/twiml/twiml.generator.js
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const config = require('../config/config');

/**
 * Generador principal de TwiML
 * Maneja la creación de diferentes tipos de respuestas de voz
 */
class TwiMLGenerator {
  
  /**
   * Genera TwiML simple con un mensaje de voz
   * @param {string} message - Mensaje a reproducir
   * @param {object} options - Opciones de configuración
   * @returns {string} TwiML XML
   */
  static generateSimpleMessage = (message, options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language,
      loop: options.loop || 1
    };
    
    twiml.say(sayOptions, message);
    
    if (options.hangup !== false) {
      twiml.hangup();
    }
    
    return twiml.toString();
  };
  
  /**
   * Genera TwiML con menú interactivo
   * @param {string} welcomeMessage - Mensaje de bienvenida
   * @param {object} menuOptions - Opciones del menú
   * @param {object} options - Opciones de configuración
   * @returns {string} TwiML XML
   */
  static generateInteractiveMenu = (welcomeMessage, menuOptions = {}, options = {}) => {
    const twiml = new VoiceResponse();
    
    const gatherOptions = {
      timeout: options.timeout || 10,
      numDigits: options.numDigits || 1,
      action: options.action || '/twiml/main-menu',
      method: 'POST'
    };
    
    const gather = twiml.gather(gatherOptions);
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    gather.say(sayOptions, welcomeMessage);
    
    // Mensaje si no hay respuesta
    const timeoutMessage = options.timeoutMessage || 'No recibimos ninguna respuesta. Gracias por llamar.';
    twiml.say(sayOptions, timeoutMessage);
    twiml.hangup();
    
    return twiml.toString();
  };
  
  /**
   * Genera TwiML con reproducción de audio
   * @param {string} audioUrl - URL del archivo de audio
   * @param {string} fallbackMessage - Mensaje si falla el audio
   * @param {object} options - Opciones de configuración
   * @returns {string} TwiML XML
   */
  static generateAudioMessage = (audioUrl, fallbackMessage = '', options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    try {
      twiml.play(audioUrl);
    } catch (error) {
      if (fallbackMessage) {
        twiml.say(sayOptions, fallbackMessage);
      }
    }
    
    if (options.hangup !== false) {
      twiml.hangup();
    }
    
    return twiml.toString();
  };
  
  /**
   * Genera TwiML para grabar mensaje
   * @param {string} prompt - Mensaje antes de grabar
   * @param {object} options - Opciones de grabación
   * @returns {string} TwiML XML
   */
  static generateRecordingPrompt = (prompt, options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    if (prompt) {
      twiml.say(sayOptions, prompt);
    }
    
    const recordOptions = {
      timeout: options.timeout || 30,
      maxLength: options.maxLength || 120,
      action: options.action || '/twiml/service-request',
      method: 'POST',
      playBeep: options.playBeep !== false,
      transcribe: options.transcribe || false,
      // finishOnKey: the DTMF key that will stop the recording when pressed.
      // Set to a single digit like '1'. To disable, set finishOnKey to an empty string or false.
      finishOnKey: (typeof options.finishOnKey !== 'undefined') ? options.finishOnKey : '1'
    };

    twiml.record(recordOptions);
    
    // Mensaje después de la grabación
    const afterMessage = options.afterMessage || 'Gracias por su mensaje. Adiós.';
    twiml.say(sayOptions, afterMessage);
    
    if (options.hangup && options.hangup !== false) {
      twiml.hangup();
    }
    
    return twiml.toString();
  };
  
  /**
   * Genera TwiML para redirigir llamada
   * @param {string} phoneNumber - Número al que redirigir
   * @param {string} message - Mensaje antes de redirigir
   * @param {object} options - Opciones de redirección
   * @returns {string} TwiML XML
   */
  static generateCallForward = (phoneNumber, message = '', options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    if (message) {
      twiml.say(sayOptions, message);
    }
    
    const dialOptions = {
      timeout: options.timeout || 30,
      callerId: options.callerId,
      action: options.action || '/call/status-webhook',
      method: 'POST'
    };
    
    twiml.dial(dialOptions, phoneNumber);
    
    // Mensaje si no contestan
    const noAnswerMessage = options.noAnswerMessage || 'Lo sentimos, no pudimos conectar su llamada. Adiós.';
    twiml.say(sayOptions, noAnswerMessage);
    twiml.hangup();
    
    return twiml.toString();
  };
  
  /**
   * Genera TwiML de error
   * @param {string} errorMessage - Mensaje de error personalizado
   * @param {object} options - Opciones de configuración
   * @returns {string} TwiML XML
   */
  static generateErrorMessage = (errorMessage = '', options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    const defaultError = 'Lo sentimos, ha ocurrido un error. Por favor intente más tarde. Adiós.';
    const message = errorMessage || defaultError;
    
    twiml.say(sayOptions, message);
    twiml.hangup();
    
    return twiml.toString();
  };

  /**
   * Genera TwiML para capturar respuesta del usuario (DTMF o voz)
   * @param {string} prompt - Mensaje que solicita la respuesta
   * @param {object} options - Opciones de captura
   * @returns {string} TwiML XML
   */
  static generateResponseCapture = (prompt, options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    // Configuración del gather para capturar respuesta
    const gatherOptions = {
      timeout: options.timeout || 10,
      numDigits: options.numDigits || 1,
      action: options.action || '/twiml/process-response',
      method: 'POST',
      playBeep: options.playBeep || false,
      finishOnKey: options.finishOnKey || '#'
    };
    
    // Si se permite entrada de voz
    if (options.speechEnabled) {
      gatherOptions.input = 'dtmf speech';
      gatherOptions.speechTimeout = options.speechTimeout || 'auto';
      gatherOptions.language = options.speechLanguage || config.twilio.language;
    } else {
      gatherOptions.input = 'dtmf';
    }
    
    const gather = twiml.gather(gatherOptions);
    
    // Reproducir el prompt
    if (prompt) {
      gather.say(sayOptions, prompt);
    }
    
    // Mensaje si no hay respuesta
    const timeoutMessage = options.timeoutMessage || 'dont receive any response. Trying again...';
    twiml.say(sayOptions, timeoutMessage);
    
    // Redirigir o reintentar
    if (options.retryAction) {
      twiml.redirect(options.retryAction);
    } else {
      twiml.hangup();
    }
    
    return twiml.toString();
  };

  /**
   * Procesa la respuesta capturada y determina la siguiente acción
   * @param {object} twilioRequest - Request de Twilio con la respuesta
   * @param {object} responseMap - Mapeo de respuestas a acciones
   * @returns {object} Información de la siguiente acción
   */
  static processUserResponse = (twilioRequest, responseMap = {}) => {
    const digits = twilioRequest.Digits || '';
    const speechResult = twilioRequest.SpeechResult || '';
    const confidence = twilioRequest.Confidence || 0;
    
    // Procesar respuesta DTMF
    if (digits) {
      const action = responseMap[digits];
      return {
        type: 'dtmf',
        input: digits,
        action: action || responseMap.default || null,
        confidence: 1.0
      };
    }
    
    // Procesar respuesta de voz
    if (speechResult) {
      const normalizedSpeech = speechResult.toLowerCase().trim();
      
      // Buscar coincidencias en el mapa de respuestas
      for (const [key, action] of Object.entries(responseMap)) {
        if (key !== 'default' && normalizedSpeech.includes(key.toLowerCase())) {
          return {
            type: 'speech',
            input: speechResult,
            normalizedInput: normalizedSpeech,
            action: action,
            confidence: parseFloat(confidence)
          };
        }
      }
      
      return {
        type: 'speech',
        input: speechResult,
        normalizedInput: normalizedSpeech,
        action: responseMap.default || null,
        confidence: parseFloat(confidence)
      };
    }
    
    // No hay respuesta válida
    return {
      type: 'no_input',
      input: null,
      action: responseMap.no_input || responseMap.default || null,
      confidence: 0
    };
  };

  /**
   * Genera TwiML basado en la respuesta procesada
   * @param {object} processedResponse - Respuesta procesada por processUserResponse
   * @param {object} actionHandlers - Manejadores de acciones
   * @param {object} options - Opciones adicionales
   * @returns {string} TwiML XML
   */
  static generateNextAction = (processedResponse, actionHandlers = {}, options = {}) => {
    const twiml = new VoiceResponse();
    
    const sayOptions = {
      voice: options.voice || config.twilio.voice,
      language: options.language || config.twilio.language
    };
    
    const action = processedResponse.action;
    
    if (action && actionHandlers[action]) {
      const handler = actionHandlers[action];
      
      // Mensaje de confirmación opcional
      if (handler.confirmMessage) {
        twiml.say(sayOptions, handler.confirmMessage);
      }
      
      // Ejecutar la acción
      if (handler.redirect) {
        twiml.redirect(handler.redirect);
      } else if (handler.message) {
        twiml.say(sayOptions, handler.message);
        if (handler.hangup !== false) {
          twiml.hangup();
        }
      } else if (handler.gather) {
        // Nuevo gather para capturar más información
        const gather = twiml.gather(handler.gather.options || {});
        gather.say(sayOptions, handler.gather.prompt);
      }
    } else {
      // Acción no reconocida
      const errorMessage = options.unrecognizedMessage || 
        'Lo sentimos, no entendimos su respuesta. Por favor intente de nuevo.';
      twiml.say(sayOptions, errorMessage);
      
      if (options.retryAction) {
        twiml.redirect(options.retryAction);
      } else {
        twiml.hangup();
      }
    }
    
    return twiml.toString();
  };
}

module.exports = TwiMLGenerator;