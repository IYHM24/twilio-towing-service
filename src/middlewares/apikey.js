// src/middlewares/apikey.js
const config = require('../config/config');

function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === config.smsProviderApiKey) {
    return next();
  }
  return res.status(401).json({ error: 'ApiKey inválida o faltante' });
}

module.exports = apiKeyAuth;
