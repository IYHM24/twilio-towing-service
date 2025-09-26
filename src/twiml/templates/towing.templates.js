// src/twiml/templates/towing.templates.js
const TwiMLGenerator = require('../twiml.generator');

/**
 * Templates específicos para empresa de grúas
 */
class TowingTemplates {
  
  /**
   * Mensaje de bienvenida principal
   */
  static welcomeMessage = (companyName = 'Brownsquare') => {
    const message = `Hola, gracias por contactar a ${companyName}. 
    Presione 1 para solicitar un servicio de grúa.
    Presione 2 para consultar el estado de su servicio.
    Presione 3 para hablar con un operador.
    Presione 0 para repetir este menú.`;
    
    return TwiMLGenerator.generateInteractiveMenu(message, {}, {
      timeout: 15,
      numDigits: 1,
      action: '/twiml/main-menu',
      timeoutMessage: 'No recibimos su selección. Conectándolo con un operador. Por favor espere.'
    });
  };
  
  /**
   * Mensaje para solicitar servicio de grúa
   */
  static requestService = () => {
    const message = `Ha seleccionado solicitar un servicio de grúa.
    Por favor, después del tono, proporcione su ubicación exacta, 
    el tipo de vehículo y una descripción breve del problema.
    Tiene hasta 2 minutos para dejar su mensaje.`;
    
    return TwiMLGenerator.generateRecordingPrompt(message, {
      timeout: 10,
      maxLength: 120,
      action: '/twiml/service-request',
      afterMessage: 'Hemos recibido su solicitud. Un operador se comunicará con usted en los próximos 15 minutos. Gracias.'
    });
  };
  
  /**
   * Mensaje para consultar estado del servicio
   */
  static checkStatus = () => {
    const message = `Para consultar el estado de su servicio,
    por favor ingrese el número de referencia de 4 dígitos que le proporcionamos,
    seguido de la tecla numeral.`;
    
    return TwiMLGenerator.generateInteractiveMenu(message, {}, {
      timeout: 30,
      numDigits: 5, // 4 dígitos + #
      action: '/twiml/service-status',
      timeoutMessage: 'No recibimos el número de referencia. Conectándolo con un operador.'
    });
  };
  
  /**
   * Mensaje para conectar con operador
   */
  static connectOperator = (operatorNumber = '+1234567890') => {
    const message = 'Conectándolo con un operador. Por favor espere.';
    
    return TwiMLGenerator.generateCallForward(operatorNumber, message, {
      timeout: 30,
      noAnswerMessage: 'Todos nuestros operadores están ocupados. Por favor deje un mensaje después del tono.',
      action: '/call/status-webhook'
    });
  };
  
  /**
   * Mensaje de confirmación de servicio
   */
  static serviceConfirmation = (serviceId, estimatedTime = '30 minutos') => {
    const message = `Su solicitud de servicio número ${serviceId} ha sido confirmada.
    Nuestro técnico llegará en aproximadamente ${estimatedTime}.
    Recibirá una llamada cuando el técnico esté en camino.
    Gracias por elegir nuestros servicios.`;
    
    return TwiMLGenerator.generateSimpleMessage(message);
  };
  
  /**
   * Mensaje de actualización de estado
   */
  static statusUpdate = (status, additionalInfo = '') => {
    let message = '';
    
    switch (status.toLowerCase()) {
      case 'en_camino':
        message = `Su técnico está en camino y llegará en aproximadamente 15 minutos. ${additionalInfo}`;
        break;
      case 'llegado':
        message = `Su técnico ha llegado a la ubicación. Por favor, acérquese al vehículo de servicio. ${additionalInfo}`;
        break;
      case 'en_proceso':
        message = `Su vehículo está siendo atendido. El servicio estará completado en breve. ${additionalInfo}`;
        break;
      case 'completado':
        message = `Su servicio ha sido completado exitosamente. Gracias por confiar en nosotros. ${additionalInfo}`;
        break;
      default:
        message = `Estado de su servicio: ${status}. ${additionalInfo}`;
    }
    
    return TwiMLGenerator.generateSimpleMessage(message);
  };
  
  /**
   * Mensaje de emergencia
   */
  static emergencyMessage = () => {
    const message = `Si esta es una emergencia médica, cuelgue inmediatamente y marque 911.
    Para emergencias de vehículos en autopistas, presione 1.
    Para otros servicios de emergencia, presione 2.
    Para regresar al menú principal, presione 3.`;
    
    return TwiMLGenerator.generateInteractiveMenu(message, {}, {
      timeout: 20,
      numDigits: 1,
      action: '/twiml/emergency',
      timeoutMessage: 'Conectándolo con nuestro servicio de emergencia.'
    });
  };
  
  /**
   * Mensaje de horario de atención
   */
  static businessHours = (isOpen = true, openHours = '24 horas') => {
    let message = '';
    
    if (isOpen) {
      message = `Nuestro horario de atención es ${openHours}.
      Actualmente estamos disponibles para atenderle.
      Presione 1 para continuar al menú principal.`;
    } else {
      message = `Gracias por llamar. Nuestro horario de atención es ${openHours}.
      Actualmente estamos fuera del horario de atención.
      Para emergencias, presione 1.
      Para dejar un mensaje, presione 2.`;
    }
    
    const action = isOpen ? '/twiml/main-menu' : '/twiml/emergency';
    
    return TwiMLGenerator.generateInteractiveMenu(message, {}, {
      timeout: 15,
      numDigits: 1,
      action: action
    });
  };
  
  /**
   * Mensaje de despedida
   */
  static goodbye = (customerName = '') => {
    const message = customerName 
      ? `Gracias ${customerName} por contactar nuestros servicios. Que tenga un excelente día.`
      : 'Gracias por contactar nuestros servicios. Que tenga un excelente día.';
    
    return TwiMLGenerator.generateSimpleMessage(message);
  };
}

module.exports = TowingTemplates;