# 🎙️ Sistema TwiML - Documentación

## 📁 Estructura de Carpetas

```
src/twiml/
├── twiml.generator.js          # Generador principal de TwiML
├── twiml.controller.js         # Controlador para manejar respuestas
├── templates/
│   └── towing.templates.js     # Templates específicos para grúas
└── README.md                   # Esta documentación
```

## 🚀 Características del Sistema

### ✨ **TwiMLGenerator** - Generador Principal
- `generateSimpleMessage()` - Mensajes de voz simples
- `generateInteractiveMenu()` - Menús con opciones numéricas  
- `generateAudioMessage()` - Reproducir archivos de audio
- `generateRecordingPrompt()` - Grabar mensajes del usuario
- `generateCallForward()` - Redirigir llamadas
- `generateErrorMessage()` - Mensajes de error

### 🏗️ **TowingTemplates** - Templates Específicos
- `welcomeMessage()` - Menú principal de la empresa
- `requestService()` - Solicitar servicio de grúa
- `checkStatus()` - Consultar estado del servicio
- `connectOperator()` - Conectar con operador
- `serviceConfirmation()` - Confirmar servicio solicitado
- `statusUpdate()` - Actualizar estado del servicio
- `emergencyMessage()` - Manejo de emergencias
- `businessHours()` - Información de horarios
- `goodbye()` - Mensaje de despedida

## 🎯 Tipos de Llamadas Disponibles

### 1. **Menú Principal** (`main-menu`)
```bash
curl -X POST http://localhost:3000/call/make \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "to": "+1234567890",
    "callType": "main-menu"
  }'
```

### 2. **Mensaje Personalizado** (`custom`)
```bash
curl -X POST http://localhost:3000/call/make \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "to": "+1234567890",
    "callType": "custom",
    "message": "Su vehículo está siendo remolcado desde la calle 123.",
    "options": {
      "voice": "alice",
      "language": "es-MX"
    }
  }'
```

### 3. **Emergencias** (`emergency`)
```bash
curl -X POST http://localhost:3000/call/make \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "to": "+1234567890",
    "callType": "emergency"
  }'
```

### 4. **Horarios de Atención** (`business-hours`)
```bash
curl -X POST http://localhost:3000/call/make \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "to": "+1234567890",
    "callType": "business-hours"
  }'
```

## 🔗 URLs de TwiML Disponibles

| URL | Descripción | Método |
|-----|-------------|---------|
| `/twiml/main-menu` | Menú principal | GET/POST |
| `/twiml/service-request` | Procesar solicitud de servicio | POST |
| `/twiml/service-status` | Consultar estado del servicio | POST |
| `/twiml/emergency` | Menú de emergencias | GET/POST |
| `/twiml/business-hours` | Información de horarios | GET |
| `/twiml/custom` | Mensaje personalizado | GET |

## 🎭 Flujo del Sistema IVR

```
📞 Llamada Entrante
    ↓
🎵 Menú Principal
    ├── 1️⃣ Solicitar Servicio → 📝 Grabar Mensaje → ✅ Confirmación
    ├── 2️⃣ Consultar Estado → 🔢 Ingresar ID → 📊 Estado Actual  
    ├── 3️⃣ Hablar con Operador → 📞 Transferir Llamada
    └── 0️⃣ Repetir Menú → 🔄 Volver al Inicio
```

## 🛠️ Configuración

### Variables de Entorno Necesarias:
```bash
# Información de la empresa
COMPANY_NAME=Servicios de Grúa Elite
OPERATOR_PHONE=+1234567890

# Horarios de atención  
BUSINESS_24_7=true
OPEN_HOUR=8
CLOSE_HOUR=18
```

## 📊 Códigos de Respuesta del Menú

| Código | Acción |
|--------|---------|
| `1` | Solicitar servicio de grúa |
| `2` | Consultar estado del servicio |
| `3` | Conectar con operador |
| `0` | Repetir menú |
| Otro | Opción inválida → Repetir menú |

## 🎯 Ejemplo de Respuesta TwiML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather timeout="15" numDigits="1" action="/twiml/main-menu" method="POST">
        <Say voice="alice" language="es-MX">
            Hola, gracias por contactar a Servicios de Grúa Elite. 
            Presione 1 para solicitar un servicio de grúa.
            Presione 2 para consultar el estado de su servicio.
            Presione 3 para hablar con un operador.
            Presione 0 para repetir este menú.
        </Say>
    </Gather>
    <Say voice="alice" language="es-MX">
        No recibimos su selección. Conectándolo con un operador. Por favor espere.
    </Say>
</Response>
```

## 🚨 Manejo de Errores

El sistema incluye manejo robusto de errores:
- ✅ Validación de entrada del usuario
- ✅ Fallbacks automáticos 
- ✅ Mensajes de error personalizados
- ✅ Redirección a operador en caso de falla
- ✅ Logging detallado de eventos

## 🔧 Personalización

Para personalizar los mensajes:

1. **Editar templates:** Modifica `src/twiml/templates/towing.templates.js`
2. **Crear nuevos generadores:** Extiende `TwiMLGenerator` 
3. **Añadir nuevas rutas:** Actualiza `src/routes/twiml.routes.js`
4. **Configurar variables:** Actualiza tu archivo `.env`

¡El sistema está listo para manejar un flujo completo de IVR para tu empresa de grúas! 🚛✨