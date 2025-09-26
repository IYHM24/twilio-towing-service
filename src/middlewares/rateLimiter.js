// src/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Rate limiting para SMS (prevenir spam)
const smsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 SMS por IP cada 15 minutos
  message: {
    error: 'Demasiadas peticiones de SMS. Inténtalo de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting general para la API
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP cada 15 minutos
  message: {
    error: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.'
  }
});

module.exports = {
  smsRateLimit,
  apiRateLimit
};