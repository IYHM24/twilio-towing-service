# 📚 Documentación Completa del Proyecto - Twilio Towing Service

## 🎯 Visión General

Este es un sistema completo de **API REST** para una empresa de grúas que utiliza **Twilio** para:
- 📱 Enviar mensajes SMS
- 📞 Realizar llamadas telefónicas automatizadas
- 🎙️ Manejar un sistema IVR (Interactive Voice Response) completo
- 🛡️ Seguridad robusta con API Keys y rate limiting

---

## 📁 Estructura del Proyecto

```
src/
├── app.js                      # 🏗️ Configuración principal de Express
├── server.js                   # 🚀 Punto de entrada del servidor
├── swagger.json                # 📖 Documentación de la API
├── config/
│   └── config.js              # ⚙️ Configuración de variables de entorno
├── controllers/               # 🎮 Lógica de negocio
│   ├── call.controller.js     # 📞 Controlador de llamadas
│   └── sms.controller.js      # 📱 Controlador de SMS
├── middlewares/               # 🛡️ Seguridad y validaciones
│   ├── apikey.js             # 🔑 Autenticación por API Key
│   ├── logger.js             # 📝 Logging de peticiones
│   ├── rateLimiter.js        # 🚦 Límite de peticiones
│   ├── security.js           # 🛡️ Validaciones y CORS
│   └── simple-example.js     # 📚 Ejemplos de middlewares
├── routes/                    # 🛣️ Definición de rutas
│   ├── call.routes.js        # 📞 Rutas de llamadas
│   ├── sms.routes.js         # 📱 Rutas de SMS
│   └── twiml.routes.js       # 🎙️ Rutas del sistema IVR
├── services/                  # 🔧 Lógica de integración con Twilio
│   ├── outgoing.call.service.js  # 📞 Servicio de llamadas
│   └── sms.service.js            # 📱 Servicio de SMS
└── twiml/                     # 🎙️ Sistema IVR completo
    ├── twiml.generator.js     # 🏭 Generador de respuestas TwiML
    ├── twiml.controller.js    # 🎮 Controlador del IVR
    ├── README.md              # 📖 Documentación del IVR
    └── templates/
        └── towing.templates.js # 🚛 Templates específicos para grúas
```

---

## 🔧 Componentes Principales

### 1. **🏗️ Configuración Principal (`app.js`)**

```javascript
// Este archivo configura toda la aplicación Express
const express = require('express');
const app = express();

// Middlewares de seguridad globales
app.use(helmet);              // Headers de seguridad HTTP
app.use(cors);                // Control de acceso entre dominios
app.use(apiRateLimit);        // Límite de peticiones por IP
app.use(logger);              // Registro de todas las peticiones

// Middlewares de parsing
app.use(express.json());      // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear formularios

// Rutas de la API
app.use('/sms', smsRoutes);    // Rutas de SMS
app.use('/call', callRoutes);  // Rutas de llamadas
app.use('/twiml', twimlRoutes); // Rutas del IVR

// Documentación automática
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

**¿Qué hace?**
- Configura Express.js como servidor web
- Aplica middlewares de seguridad a todas las rutas
- Define las rutas principales de la API
- Configura la documentación automática con Swagger

---

### 2. **⚙️ Configuración (`config/config.js`)**

```javascript
// Centraliza todas las variables de entorno
module.exports = {
  port: process.env.PORT || 3000,
  smsProviderApiKey: process.env.SMS_API_KEY || 'demo-key',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,     // Tu SID de Twilio
    authToken: process.env.TWILIO_AUTH_TOKEN,       // Tu token de Twilio
    phoneNumber: process.env.TWILIO_PHONE_NUMBER    // Tu número de Twilio
  }
};
```

**¿Qué hace?**
- Lee variables de entorno del archivo `.env`
- Proporciona valores por defecto para desarrollo
- Centraliza toda la configuración en un solo lugar

---

### 3. **🛡️ Middlewares de Seguridad**

#### **🔑 Autenticación (`middlewares/apikey.js`)**
```javascript
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === config.smsProviderApiKey) {
    return next(); // ✅ API Key válida, continuar
  }
  return res.status(401).json({ error: 'ApiKey inválida o faltante' });
};
```

**¿Qué hace?**
- Verifica que cada petición tenga un header `x-api-key`
- Compara la API key con la configurada en el servidor
- Bloquea peticiones sin API key válida

#### **🚦 Rate Limiting (`middlewares/rateLimiter.js`)**
```javascript
const smsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 SMS por IP cada 15 minutos
  message: { error: 'Demasiadas peticiones de SMS' }
});
```

**¿Qué hace?**
- Limita el número de peticiones por IP
- Previene spam y abuso del sistema
- Diferentes límites para SMS vs llamadas

#### **🛡️ Validaciones (`middlewares/security.js`)**
```javascript
const validatePhoneNumber = (req, res, next) => {
  const { to } = req.body;
  const phoneRegex = /^\\+[1-9]\\d{1,14}$/; // Formato E.164
  if (!phoneRegex.test(to)) {
    return res.status(400).json({
      error: 'Formato de número inválido. Use formato E.164 (+1234567890)'
    });
  }
  next();
};
```

**¿Qué hace?**
- Valida que los números de teléfono estén en formato internacional
- Verifica que los mensajes no estén vacíos o sean muy largos
- Sanitiza la entrada de datos

---

### 4. **📱 Servicio de SMS (`services/sms.service.js`)**

```javascript
const sendSms = async (to, message) => {
  try {
    // Usar el cliente de Twilio para enviar SMS
    const response = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to
    });
    
    return { 
      success: true, 
      sid: response.sid,    // ID único del mensaje
      status: response.status,
      to: response.to,
      from: response.from
    };
  } catch (error) {
    // Manejo específico de errores de Twilio
    let errorMessage = error.message;
    
    if (error.code === 21408) {
      errorMessage = `Permisos no habilitados para enviar SMS a ${to}`;
    }
    // ... más códigos de error
    
    return { 
      success: false, 
      error: errorMessage,
      code: error.code
    };
  }
};
```

**¿Qué hace?**
- Se conecta a la API de Twilio para enviar SMS
- Maneja errores específicos de Twilio con mensajes claros
- Retorna información detallada sobre el estado del envío

---

### 5. **📞 Servicio de Llamadas (`services/outgoing.call.service.js`)**

```javascript
const makeCall = async (to, twimlUrl, options = {}) => {
  try {
    const callOptions = {
      to,                           // Número destino
      from: config.twilio.phoneNumber, // Tu número de Twilio
      url: twimlUrl,               // URL con las instrucciones TwiML
      timeout: options.timeout || 60,
      record: options.record || false,
      statusCallback: options.statusCallback, // Webhook para updates
      ...options
    };

    const call = await client.calls.create(callOptions);
    
    return {
      success: true,
      callSid: call.sid,        // ID único de la llamada
      status: call.status,      // Estado inicial
      to: call.to,
      from: call.from
    };
  } catch (error) {
    // Manejo de errores específicos de llamadas
    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
};
```

**¿Qué hace?**
- Inicia llamadas telefónicas usando Twilio
- Configura opciones como grabación, timeouts, webhooks
- Proporciona el estado en tiempo real de las llamadas

---

### 6. **🎙️ Sistema IVR - Generador TwiML (`twiml/twiml.generator.js`)**

```javascript
class TwiMLGenerator {
  // Genera mensaje simple de voz
  static generateSimpleMessage = (message, options = {}) => {
    const twiml = new VoiceResponse();
    
    twiml.say({
      voice: options.voice || 'alice',    // Voz del sistema
      language: options.language || 'es-MX' // Idioma
    }, message);
    
    twiml.hangup(); // Colgar después del mensaje
    return twiml.toString(); // Devolver XML
  };

  // Genera menú interactivo
  static generateInteractiveMenu = (welcomeMessage, menuOptions = {}, options = {}) => {
    const twiml = new VoiceResponse();
    
    const gather = twiml.gather({
      timeout: options.timeout || 10,
      numDigits: options.numDigits || 1,
      action: options.action || '/twiml/main-menu', // Donde procesar la selección
      method: 'POST'
    });
    
    gather.say({ voice: 'alice', language: 'es-MX' }, welcomeMessage);
    
    // Si no hay respuesta
    twiml.say({ voice: 'alice', language: 'es-MX' }, 
      'No recibimos ninguna respuesta. Gracias por llamar.');
    twiml.hangup();
    
    return twiml.toString();
  };
}
```

**¿Qué hace?**
- Genera XML en formato TwiML (lenguaje de Twilio)
- Crea diferentes tipos de respuestas: mensajes, menús, grabaciones
- Maneja opciones de voz, idioma y comportamiento

---

### 7. **🚛 Templates para Grúas (`twiml/templates/towing.templates.js`)**

```javascript
class TowingTemplates {
  // Menú principal del sistema
  static welcomeMessage = (companyName = 'Brownsquare') => {
    const message = `Hola, gracias por contactar a ${companyName}. 
    Presione 1 para solicitar un servicio de grúa.
    Presione 2 para consultar el estado de su servicio.
    Presione 3 para hablar con un operador.
    Presione 0 para repetir este menú.`;
    
    return TwiMLGenerator.generateInteractiveMenu(message, {}, {
      timeout: 15,
      numDigits: 1,
      action: '/twiml/main-menu' // Donde procesar la selección
    });
  };

  // Solicitud de servicio con grabación
  static requestService = () => {
    const message = `Ha seleccionado solicitar un servicio de grúa.
    Por favor, después del tono, proporcione su ubicación exacta, 
    el tipo de vehículo y una descripción breve del problema.`;
    
    return TwiMLGenerator.generateRecordingPrompt(message, {
      timeout: 10,
      maxLength: 120, // 2 minutos máximo
      action: '/twiml/service-request' // Donde procesar la grabación
    });
  };
}
```

**¿Qué hace?**
- Define mensajes específicos para empresa de grúas
- Crea flujos de conversación lógicos
- Personaliza respuestas según el contexto del negocio

---

### 8. **🎮 Controlador IVR (`twiml/twiml.controller.js`)**

```javascript
class TwiMLController {
  // Maneja el menú principal
  static mainMenu = (req, res) => {
    try {
      const companyName = process.env.COMPANY_NAME || 'Servicios de Grúa Elite';
      const twiml = TowingTemplates.welcomeMessage(companyName);
      
      res.set('Content-Type', 'text/xml'); // Importante: XML, no JSON
      res.send(twiml);
    } catch (error) {
      const errorTwiml = TwiMLGenerator.generateErrorMessage();
      res.set('Content-Type', 'text/xml');
      res.send(errorTwiml);
    }
  };

  // Procesa la selección del usuario
  static processMainMenu = (req, res) => {
    const { Digits } = req.body; // Twilio envía el dígito presionado
    let twiml = '';
    
    switch (Digits) {
      case '1': // Solicitar servicio
        twiml = TowingTemplates.requestService();
        break;
      case '2': // Consultar estado
        twiml = TowingTemplates.checkStatus();
        break;
      case '3': // Hablar con operador
        twiml = TowingTemplates.connectOperator(operatorNumber);
        break;
      default: // Opción inválida
        twiml = TwiMLGenerator.generateSimpleMessage('Opción inválida');
    }
    
    res.set('Content-Type', 'text/xml');
    res.send(twiml);
  };
}
```

**¿Qué hace?**
- Recibe peticiones de Twilio cuando el usuario interactúa
- Procesa las selecciones del menú (1, 2, 3, etc.)
- Genera respuestas TwiML apropiadas
- Maneja errores y situaciones inesperadas

---

## 🔄 Flujo Completo de una Llamada

### **Paso 1: Iniciar Llamada**
```bash
POST /call/make
{
  "to": "+573001234567",
  "callType": "main-menu"
}
```

### **Paso 2: Tu servidor responde**
```javascript
// call.controller.js genera URL de TwiML
twimlUrl = "http://tu-servidor.com/twiml/main-menu"
// Twilio llama a esa URL
```

### **Paso 3: Twilio pide el TwiML**
```
GET http://tu-servidor.com/twiml/main-menu
```

### **Paso 4: Tu servidor responde con TwiML**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather timeout="15" numDigits="1" action="/twiml/main-menu" method="POST">
    <Say voice="alice" language="es-MX">
      Hola, gracias por contactar a Brownsquare...
    </Say>
  </Gather>
</Response>
```

### **Paso 5: Usuario presiona "1"**
```
POST http://tu-servidor.com/twiml/main-menu
Body: Digits=1
```

### **Paso 6: Tu servidor procesa y responde**
```javascript
// twiml.controller.js
case '1':
  twiml = TowingTemplates.requestService(); // Nuevo TwiML
```

### **Paso 7: El ciclo continúa...**
Hasta que la llamada termine o se cuelgue.

---

## 🛡️ Seguridad Implementada

### **🔑 Autenticación**
- API Key en header `x-api-key`
- Endpoints protegidos vs públicos
- Validación en cada petición

### **🚦 Rate Limiting**
- SMS: 10 por 15 minutos por IP
- API general: 100 por 15 minutos por IP
- Previene spam y abuso

### **🛡️ Validaciones**
- Números de teléfono en formato E.164
- Longitud de mensajes
- Sanitización de entrada
- Headers de seguridad (Helmet)
- CORS configurado

### **📝 Logging**
- Todas las peticiones registradas
- Errores detallados
- Estados de llamadas y SMS

---

## 🎯 Tipos de Endpoints

### **🔒 Protegidos (requieren API Key):**
- `POST /sms/send` - Enviar SMS
- `POST /call/make` - Realizar llamada
- `GET /call/status/{callSid}` - Estado de llamada
- `POST /call/hangup/{callSid}` - Terminar llamada

### **🌐 Públicos (sin autenticación):**
- `GET/POST /twiml/*` - Respuestas IVR
- `POST /call/status-webhook` - Webhooks de Twilio
- `GET /api-docs` - Documentación

---

## 📊 Estados y Códigos

### **Estados de SMS:**
- `queued` - En cola para envío
- `sent` - Enviado al operador
- `delivered` - Entregado al usuario
- `failed` - Fallo en el envío

### **Estados de Llamadas:**
- `queued` - En cola
- `ringing` - Sonando
- `answered` - Contestada
- `completed` - Terminada
- `busy` - Ocupado
- `no-answer` - No contestaron

### **Códigos de Error Comunes:**
- `21408` - Permisos geográficos no habilitados
- `21211` - Número de teléfono inválido
- `20003` - Credenciales de Twilio inválidas

---

## 🚀 Cómo Ejecutar

### **1. Instalar dependencias:**
```bash
npm install
```

### **2. Configurar variables:**
```bash
cp .env.example .env
# Editar .env con tus credenciales de Twilio
```

### **3. Iniciar servidor:**
```bash
npm start
# o
node src/server.js
```

### **4. Ver documentación:**
```
http://localhost:3000/api-docs
```

---

## 📚 Recursos Adicionales

- **📖 Documentación Swagger:** `/api-docs`
- **🎙️ Documentación IVR:** `src/twiml/README.md`
- **📋 Ejemplos de uso:** `EXAMPLES.md`
- **🧪 Middlewares de ejemplo:** `src/middlewares/simple-example.js`

---

## 🎯 Conclusión

Este proyecto es una **API completa y profesional** que demuestra:

- ✅ **Arquitectura limpia** con separación de responsabilidades
- ✅ **Seguridad robusta** con múltiples capas de protección
- ✅ **Manejo de errores** específico para cada situación
- ✅ **Sistema IVR completo** con flujos de conversación
- ✅ **Documentación automática** con Swagger
- ✅ **Código mantenible** con arrow functions y buenas prácticas
- ✅ **Integración completa** con Twilio para SMS y llamadas

¡Es un ejemplo perfecto de cómo construir una API moderna y escalable! 🚀