// src/twiml/twiml.controller.js
const TwiMLGenerator = require('./twiml.generator');
const TowingTemplates = require('./templates/towing.templates');
const config = require('../config/config');

/**
 * Controlador para manejar todas las respuestas TwiML
 */
class TwiMLController {

  /***
     * Bienvenida y menú principal
     *  */
  static welcomeMessage = (req, res) => {
    try {
      const companyName = process.env.COMPANY_NAME || 'Servicios de Grúa Elite';
      const twiml = TowingTemplates.welcomeMessage(companyName);
      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error en bienvenida:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  }

  /**
   * Menú principal de la empresa de grúas
   */
  static mainMenu = (req, res) => {
    try {
      const companyName = process.env.COMPANY_NAME || 'Servicios de Grúa Elite';
      const twiml = TowingTemplates.welcomeMessage(companyName);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error en menú principal:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Procesar selección del menú principal
   */
  static processMainMenu = (req, res) => {
    try {
      const { Digits } = req.body;
      let twiml = '';

      switch (Digits) {
        case '1':
          // Solicitar servicio de grúa
          twiml = TowingTemplates.TowOption();
          break;
        case '2':
          // Consultar estado del servicio
          twiml = TowingTemplates.checkStatus();
          break;
        case '3':
          // Hablar con operador
          const operatorNumber = process.env.OPERATOR_PHONE || '+1234567890';
          twiml = TowingTemplates.connectOperator(operatorNumber);
          break;
        case '0':
          // Repetir menú
          const companyName = process.env.COMPANY_NAME || 'Servicios de Grúa Elite';
          twiml = TowingTemplates.welcomeMessage(companyName);
          break;
        default:
          // Opción inválida
          const message = 'Opción inválida. Regresando al menú principal.';
          twiml = TwiMLGenerator.generateSimpleMessage(message, { hangup: false });
          // Agregar redirect al menú principal
          twiml = twiml.replace('</Response>', '<Redirect>/twiml/main-menu</Redirect></Response>');
      }

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error procesando menú:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Procesar varios submenús
   */
  static TowMenu = (req, res) => {
    try {
      const { Digits } = req.body;
      let twiml = '';
      // Aquí puedes agregar lógica para manejar submenús basados en Digits
      // Por ejemplo:
      switch (Digits) {
        case '1':
          twiml = TowingTemplates.TowOption();
          break;
        case '2':
          twiml = TowingTemplates.checkStatus();
          break;
        default:
          const message = 'Opción inválida. Regresando al menú principal.';
          twiml = TwiMLGenerator.generateSimpleMessage(message, { hangup: false });
          twiml = twiml.replace('</Response>', '<Redirect>/twiml/main-menu</Redirect></Response>');
      }
      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error procesando submenú:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Procesar grabación de solicitud de servicio
   */
  static processServiceRequest = (req, res) => {
    try {
      const { RecordingUrl, RecordingDuration, CallSid } = req.body;

      // Aquí guardarías la información en tu base de datos
      console.log(`📼 Nueva solicitud de servicio:`);
      console.log(`- Call SID: ${CallSid}`);
      console.log(`- Duración: ${RecordingDuration} segundos`);
      console.log(`- Grabación: ${RecordingUrl}`);

      // Generar número de referencia único
      const serviceId = Math.floor(1000 + Math.random() * 9000);

      // Simular guardado en base de datos
      // await saveServiceRequest(CallSid, RecordingUrl, serviceId);

      const twiml = TowingTemplates.serviceConfirmation(serviceId);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error procesando solicitud:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage(
        'Error procesando su solicitud. Un operador se comunicará con usted.'
      );
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Consultar estado del servicio
   */
  static checkServiceStatus = (req, res) => {
    try {
      const { Digits } = req.body;
      const serviceId = Digits?.replace('#', '');

      if (!serviceId || serviceId.length !== 4) {
        const message = 'Número de referencia inválido. Conectándolo con un operador.';
        const operatorNumber = process.env.OPERATOR_PHONE || '+1234567890';
        const twiml = TowingTemplates.connectOperator(operatorNumber);

        res.set('Content-Type', 'text/xml');
        res.send(twiml);
        return;
      }

      // Simular consulta en base de datos
      const serviceStatus = getServiceStatus(serviceId);

      let twiml = '';
      if (serviceStatus) {
        twiml = TowingTemplates.statusUpdate(serviceStatus.status, serviceStatus.info);
      } else {
        const message = `No encontramos un servicio con el número ${serviceId}. Verificando con un operador.`;
        const operatorNumber = process.env.OPERATOR_PHONE || '+1234567890';
        twiml = TowingTemplates.connectOperator(operatorNumber);
      }

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error consultando estado:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Manejo de emergencias
   */
  static emergencyMenu = (req, res) => {
    try {
      const twiml = TowingTemplates.emergencyMessage();

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error en menú de emergencia:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Verificar horario de atención
   */
  static checkBusinessHours = (req, res) => {
    try {
      const now = new Date();
      const hour = now.getHours();

      // Simular horario 24/7 o personalizable
      const is24Hours = process.env.BUSINESS_24_7 === 'true';
      const openHour = parseInt(process.env.OPEN_HOUR || '8');
      const closeHour = parseInt(process.env.CLOSE_HOUR || '18');

      const isOpen = is24Hours || (hour >= openHour && hour < closeHour);
      const hours = is24Hours ? '24 horas' : `de ${openHour}:00 a ${closeHour}:00`;

      const twiml = TowingTemplates.businessHours(isOpen, hours);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error verificando horario:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Mensaje personalizado (para llamadas específicas) 
   */
  static customMessage = (req, res) => {
    try {
      const { message, voice, language } = req.query;

      if (!message) {
        const errorTwiml = TwiMLGenerator.generateErrorMessage('Mensaje no especificado.');
        res.set('Content-Type', 'text/xml');
        res.send(errorTwiml);
        return;
      }

      const options = {
        voice: voice || config.twilio.voice,
        language: language || config.twilio.language
      };

      const twiml = TwiMLGenerator.generateSimpleMessage(message, options);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error con mensaje personalizado:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };
}

/**
 * Función auxiliar para simular consulta de estado de servicio
 * En producción, esto consultaría una base de datos real
 */
const getServiceStatus = (serviceId) => {
  // Simulación de estados de servicio
  const mockServices = {
    '1234': { status: 'en_camino', info: 'El técnico llegará en 10 minutos.' },
    '5678': { status: 'llegado', info: 'El técnico está esperando en su vehículo.' },
    '9999': { status: 'completado', info: 'Servicio finalizado exitosamente.' }
  };

  return mockServices[serviceId] || null;
};

module.exports = TwiMLController;