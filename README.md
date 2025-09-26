# Servicio IVR Brownsquare inc

## Arquitectura

```
project-root/
│── src/
│   ├── controllers/
│   │   ├── sms.controller.js
│   │   ├── voice.controller.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── sms.routes.js
│   │   ├── voice.routes.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── twilio.service.js
│   │   └── db.service.js
│   │
│   ├── config/
│   │   ├── twilio.config.js
│   │   └── env.config.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

- **controllers/**: Lógica de negocio y manejo de peticiones.
- **routes/**: Definición de endpoints y rutas.
- **services/**: Integración con servicios externos o lógica reutilizable.
- **middlewares/**: Funciones intermedias para procesamiento de peticiones.
- **config/**: Configuración de variables y entorno.
- **app.js**: Configuración principal de Express y rutas.
- **server.js**: Punto de entrada para iniciar el servidor.

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno en el archivo `.env`.

## Ejecución

```bash
npm start
```
o
```bash
node src/server.js
```

## Ejemplo de endpoint

- POST `/sms/send`  
  Body:
  ```json
  {
    "to": "+573001234567",
    "message": "Hola desde Express!"
  }
  ```

## Notas

- Puedes agregar más rutas, controladores y servicios siguiendo la misma estructura.
- El middleware `logger` muestra en consola cada petición recibida.
