// src/middlewares/simple-example.js

// Middleware que registra cada petición
function logRequest(req, res, next) {
  console.log(`📞 Nueva petición: ${req.method} ${req.path}`);
  console.log(`🕐 Hora: ${new Date().toLocaleString()}`);
  console.log(`🌍 IP: ${req.ip}`);
  console.log('---');
  
  // ¡IMPORTANTE! Siempre llamar next() para continuar
  next();
}

// Middleware que valida que el usuario envíe JSON
function validateJSON(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(400).json({
      error: 'Por favor envía los datos en formato JSON'
    });
  }
  next();
}

// Middleware que añade información extra a la respuesta
function addExtraInfo(req, res, next) {
  // Modifica el objeto res para añadir info extra
  const originalJson = res.json;
  res.json = function(data) {
    // Añade timestamp a todas las respuestas
    data.timestamp = new Date().toISOString();
    data.version = '1.0.0';
    return originalJson.call(this, data);
  };
  next();
}

module.exports = {
  logRequest,
  validateJSON,
  addExtraInfo
};