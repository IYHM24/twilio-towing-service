# 📞 API de Llamadas y SMS con Twilio

## 🚀 Ejemplos de Uso

### 1. Enviar SMS

```bash
curl -X POST http://localhost:3000/sms/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "to": "+1234567890",
    "message": "¡Hola desde Twilio!"
  }'
```

### 2. Realizar Llamada

```bash
curl -X POST http://localhost:3000/call/make \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key" \
  -d '{
    "to": "+1234567890",
    "message": "Hola, este es un mensaje automatizado de nuestra empresa de grúas. Su vehículo está siendo remolcado.",
    "options": {
      "timeout": 30,
      "record": true
    }
  }'
```

### 3. Consultar Estado de Llamada

```bash
curl -X GET http://localhost:3000/call/status/CAxxxxxxxxxxxxxxxxxxxx \
  -H "x-api-key: demo-key"
```

### 4. Terminar Llamada

```bash
curl -X POST http://localhost:3000/call/hangup/CAxxxxxxxxxxxxxxxxxxxx \
  -H "x-api-key: demo-key"
```

## 📋 Respuestas Esperadas

### SMS Exitoso
```json
{
  "success": true,
  "message": "SMS enviado exitosamente",
  "sid": "SMxxxxxxxxxxxxxxxxxxxx",
  "status": "queued",
  "to": "+1234567890",
  "from": "+1987654321"
}
```

### Llamada Exitosa
```json
{
  "success": true,
  "message": "Llamada iniciada exitosamente",
  "callSid": "CAxxxxxxxxxxxxxxxxxxxx",
  "status": "queued",
  "to": "+1234567890",
  "from": "+1987654321",
  "twimlUrl": "http://localhost:3000/call/twiml/1640995200000"
}
```

### Estado de Llamada
```json
{
  "success": true,
  "callSid": "CAxxxxxxxxxxxxxxxxxxxx",
  "status": "completed",
  "duration": "15",
  "price": "-0.02000",
  "priceUnit": "USD",
  "direction": "outbound-api",
  "answeredBy": "human",
  "dateCreated": "2023-12-31T12:00:00Z",
  "startTime": "2023-12-31T12:00:05Z",
  "endTime": "2023-12-31T12:00:20Z"
}
```

## ❌ Manejo de Errores

### Error de Permisos Geográficos
```json
{
  "success": false,
  "error": "Permisos no habilitados para realizar llamadas a +57350693XXXX. Habilita los permisos geográficos en tu consola de Twilio.",
  "code": 21408
}
```

### Error de Número Inválido
```json
{
  "success": false,
  "error": "Número de teléfono inválido: +123",
  "code": 21211
}
```

### Error de API Key
```json
{
  "success": false,
  "error": "ApiKey inválida o faltante"
}
```

## 🔧 Estados de Llamada

| Estado | Descripción |
|--------|-------------|
| `queued` | Llamada en cola |
| `ringing` | Teléfono sonando |
| `answered` | Llamada contestada |
| `completed` | Llamada terminada |
| `busy` | Línea ocupada |
| `no-answer` | No contestaron |
| `failed` | Llamada falló |
| `canceled` | Llamada cancelada |

## 🎯 Configuración del Webhook

Para recibir actualizaciones de estado en tiempo real, configura el webhook en tu aplicación:

```javascript
// Tu aplicación recibirá POST requests en:
// http://tu-servidor.com/call/status-webhook

// Con datos como:
{
  "CallSid": "CAxxxxxxxxxxxxxxxxxxxx",
  "CallStatus": "completed",
  "Duration": "15",
  "AnsweredBy": "human"
}
```