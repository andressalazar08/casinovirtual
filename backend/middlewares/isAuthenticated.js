// Middleware para proteger rutas que requieren autenticación
module.exports = function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'No autenticado' });
};
