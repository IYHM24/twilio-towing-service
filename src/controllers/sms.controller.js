// src/controllers/sms.controller.js
exports.sendSms = (req, res) => {
  // Aquí iría la lógica para enviar SMS (ejemplo)
  const { to, message } = req.body;
  // Simulación de envío
  res.json({ success: true, to, message });
};
