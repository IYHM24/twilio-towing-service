// src/twiml/twiml.controller.js
const TwiMLGenerator = require('./twiml.generator');
const TowingTemplates = require('./templates/towing.templates');
const config = require('../config/config');
const WheelLiftTemplates = require('./templates/wheelLift.templates');

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
          // 
          twiml = TowingTemplates.TowOption();
          break;
        case '2':
          // 
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
   * Menu de tow
   */
  static TowMenu = (req, res) => {
    try {
      const { Digits } = req.body;
      let twiml = '';
      // Aquí puedes agregar lógica para manejar submenús basados en Digits
      // Por ejemplo:
      switch (Digits) {
        case '1':
          twiml = WheelLiftTemplates.colorAndModel();
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

  static retryLiftResponse = (req, res) => {
    try {
      console.log('Reintentando menú tow:', req.body);
      const { idRetry } = req.params;

      switch (idRetry) {
        case '1':
          // Lógica para reintentar la opción 1
          twiml = WheelLiftTemplates.colorAndModel();
          break;
        default:
          break;
      }
      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error reintentando menú tow:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /* Procesar respuestas tow */
  static processLiftResponses = (req, res) => {
    try {
      console.log('🚗 Procesando respuestas tow:', req.body);

      // Extraer información de la respuesta
      const {
        SpeechResult, Confidence,
        Digits, RecordingUrl,
        RecordingDuration, CallSid
      } = req.body;

      // Mapeo de respuestas para el flujo tow
      const responseMap = {
        default: 'vehicle_info_captured',
        no_input: 'retry_vehicle_info'
      };

      // Procesar la respuesta usando nuestro sistema
      const processedResponse = TwiMLGenerator.processUserResponse(req.body, responseMap);

      // Log detallado de la información capturada
      console.log('📝 Información del vehículo capturada:');
      if (SpeechResult) {
        console.log(`   - Descripción por voz: "${SpeechResult}"`);
        console.log(`   - Confianza: ${Confidence || 'N/A'}`);
      }
      if (Digits) {
        console.log(`   - Dígitos presionados: ${Digits}`);
      }
      if (RecordingUrl) {
        console.log(`   - Grabación disponible: ${RecordingUrl}`);
        console.log(`   - Duración: ${RecordingDuration} segundos`);
      }
      console.log(`   - Call SID: ${CallSid}`);

      // Extraer información del vehículo del speech result
      let vehicleInfo = {};

      if (SpeechResult) {
        vehicleInfo.fullDescription = SpeechResult;
      }

      // Manejadores de acciones
      const actionHandlers = {
        vehicle_info_captured: {
          confirmMessage: vehicleInfo.fullDescription
            ? `Perfecto, hemos registrado su vehículo: ${vehicleInfo.fullDescription}. Ahora necesitamos su ubicación.`
            : 'Hemos registrado la información de su vehículo. Ahora necesitamos su ubicación.',
          redirect: '/twiml/capture-pickup-location'
        },
        retry_vehicle_info: {
          message: 'No pudimos capturar la información de su vehículo. Intentemos de nuevo.',
          redirect: '/twiml/sub-menu/tow'
        }
      };

      // Generar siguiente acción
      const twiml = TwiMLGenerator.generateNextAction(processedResponse, actionHandlers, {
        unrecognizedMessage: 'Información recibida. Continuando con el siguiente paso.',
        retryAction: '/twiml/sub-menu/tow'
      });

      // TODO: Aquí guardarías la información en base de datos
      // await saveVehicleInfo(CallSid, vehicleInfo, RecordingUrl);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('❌ Error procesando respuestas tow:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage(
        'Error procesando la información del vehículo. Conectándolo con un operador.'
      );
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  }

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

  /**
   * Capturar información del cliente (ejemplo de uso de los nuevos métodos)
   */
  static captureClientInfo = (req, res) => {
    try {
      const prompt = 'Por favor, proporcione su número de teléfono presionando las teclas correspondientes, seguido de la tecla numeral.';

      const options = {
        timeout: 15,
        numDigits: 10,
        finishOnKey: '#',
        action: '/twiml/process-client-info',
        retryAction: '/twiml/capture-client-info',
        timeoutMessage: 'No recibimos su número. Intentemos de nuevo.'
      };

      const twiml = TwiMLGenerator.generateResponseCapture(prompt, options);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error capturando información del cliente:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Procesar información capturada del cliente
   */
  static processClientInfo = (req, res) => {
    try {
      // Mapeo de respuestas (no aplicable para número de teléfono, pero útil para otros casos)
      const responseMap = {
        default: 'confirm_phone',
        no_input: 'retry_phone'
      };

      // Procesar la respuesta
      const processedResponse = TwiMLGenerator.processUserResponse(req.body, responseMap);

      console.log('📞 Información del cliente capturada:', processedResponse);

      // Manejadores de acciones
      const actionHandlers = {
        confirm_phone: {
          confirmMessage: `Gracias. Hemos registrado el número ${processedResponse.input}. Un técnico se comunicará con usted pronto.`,
          message: 'Su solicitud ha sido procesada. Que tenga un buen día.',
          hangup: true
        },
        retry_phone: {
          redirect: '/twiml/capture-client-info'
        }
      };

      const twiml = TwiMLGenerator.generateNextAction(processedResponse, actionHandlers);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error procesando información del cliente:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Ejemplo avanzado: Captura con reconocimiento de voz
   */
  static captureServiceType = (req, res) => {
    try {
      const prompt = 'Díganos qué tipo de servicio necesita: remolque, batería, combustible, o presione 1 para remolque, 2 para batería, 3 para combustible.';

      const options = {
        timeout: 10,
        speechEnabled: true,
        speechTimeout: 'auto',
        numDigits: 1,
        finishOnKey: '#',
        action: '/twiml/process-service-type',
        retryAction: '/twiml/capture-service-type',
        timeoutMessage: 'No pudimos escuchar su respuesta. Intentemos nuevamente.'
      };

      const twiml = TwiMLGenerator.generateResponseCapture(prompt, options);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error capturando tipo de servicio:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Procesar tipo de servicio capturado
   */
  static processServiceType = (req, res) => {
    try {
      // Mapeo de respuestas DTMF y de voz
      const responseMap = {
        '1': 'towing_service',
        '2': 'battery_service',
        '3': 'fuel_service',
        'remolque': 'towing_service',
        'bateria': 'battery_service',
        'combustible': 'fuel_service',
        'gasolina': 'fuel_service',
        default: 'unknown_service',
        no_input: 'retry_service'
      };

      const processedResponse = TwiMLGenerator.processUserResponse(req.body, responseMap);

      console.log('🚗 Tipo de servicio solicitado:', processedResponse);

      // Manejadores de acciones específicas
      const actionHandlers = {
        towing_service: {
          confirmMessage: 'Perfecto, servicio de remolque solicitado.',
          redirect: '/twiml/capture-client-info'
        },
        battery_service: {
          confirmMessage: 'Entendido, asistencia con batería.',
          redirect: '/twiml/capture-client-info'
        },
        fuel_service: {
          confirmMessage: 'Muy bien, servicio de combustible.',
          redirect: '/twiml/capture-client-info'
        },
        unknown_service: {
          message: 'No reconocimos el tipo de servicio. Conectándolo con un operador.',
          redirect: '/twiml/connect-operator'
        },
        retry_service: {
          redirect: '/twiml/capture-service-type'
        }
      };

      const twiml = TwiMLGenerator.generateNextAction(processedResponse, actionHandlers, {
        unrecognizedMessage: 'Tipo de servicio no reconocido. Intentemos de nuevo.',
        retryAction: '/twiml/capture-service-type'
      });

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error procesando tipo de servicio:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Capturar ubicación de recogida
   */
  static capturePickupLocation = (req, res) => {
    try {
      const prompt = 'Por favor, proporcione su dirección completa de ubicación. Incluya calle, número, ciudad. Presione 1 cuando termine de hablar.';

      const options = {
        timeout: 20,
        speechEnabled: true,
        speechTimeout: 'auto',
        finishOnKey: '1',
        action: '/twiml/process-pickup-location',
        retryAction: '/twiml/capture-pickup-location',
        timeoutMessage: 'No recibimos su ubicación. Intentemos de nuevo.'
      };

      const twiml = TwiMLGenerator.generateResponseCapture(prompt, options);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error capturando ubicación:', error);
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  /**
   * Procesar ubicación de recogida
   */
  static processPickupLocation = (req, res) => {
    try {
      const { SpeechResult, Confidence, CallSid } = req.body;

      console.log('📍 Ubicación capturada:');
      console.log(`   - Dirección: "${SpeechResult || 'No capturada'}"`);
      console.log(`   - Confianza: ${Confidence || 'N/A'}`);
      console.log(`   - Call SID: ${CallSid}`);

      const responseMap = {
        default: 'location_captured',
        no_input: 'retry_location'
      };

      const processedResponse = TwiMLGenerator.processUserResponse(req.body, responseMap);

      const actionHandlers = {
        location_captured: {
          confirmMessage: SpeechResult
            ? `Perfecto, su ubicación es: ${SpeechResult}. Un técnico se dirigirá a esa dirección.`
            : 'Hemos registrado su ubicación.',
          redirect: '/twiml/capture-client-info'
        },
        retry_location: {
          message: 'No pudimos capturar su ubicación. Intentemos de nuevo.',
          redirect: '/twiml/capture-pickup-location'
        }
      };

      const twiml = TwiMLGenerator.generateNextAction(processedResponse, actionHandlers);

      // TODO: Guardar ubicación en base de datos
      // await savePickupLocation(CallSid, SpeechResult);

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    } catch (error) {
      console.error('Error procesando ubicación:', error);
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