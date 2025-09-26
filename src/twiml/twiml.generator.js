// src/twiml/twiml.generator.js
const VoiceResponse = require('twilio').twiml.VoiceResponse;

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
      voice: options.voice || 'alice',
      language: options.language || 'es-MX',
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
      voice: options.voice || 'alice',
      language: options.language || 'es-MX'
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
      voice: options.voice || 'alice',
      language: options.language || 'es-MX'
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
      voice: options.voice || 'alice',
      language: options.language || 'es-MX'
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
      transcribe: options.transcribe || false
    };
    
    twiml.record(recordOptions);
    
    // Mensaje después de la grabación
    const afterMessage = options.afterMessage || 'Gracias por su mensaje. Adiós.';
    twiml.say(sayOptions, afterMessage);
    twiml.hangup();
    
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
      voice: options.voice || 'alice',
      language: options.language || 'es-MX'
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
      voice: options.voice || 'alice',
      language: options.language || 'es-MX'
    };
    
    const defaultError = 'Lo sentimos, ha ocurrido un error. Por favor intente más tarde. Adiós.';
    const message = errorMessage || defaultError;
    
    twiml.say(sayOptions, message);
    twiml.hangup();
    
    return twiml.toString();
  };
}

module.exports = TwiMLGenerator;