// Middleware para proteger rutas que requieren autenticación
function isAuthenticated(req, res, next) {
  console.log('Session:', req.session); // Debug
  console.log('Session ID:', req.sessionID); // Debug
  console.log('User ID in session:', req.session?.userId); // Debug
  
  if (req.session && req.session.userId) {
    req.userId = req.session.userId; // Asignar userId al request
    req.userRole = req.session.userRole; // Asignar userRole al request
    return next();
  }
  return res.status(401).json({ error: 'No autenticado' });
}

// Middleware para verificar si el usuario es admin
function isAdmin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
  }
  
  return next();
}

// Middleware para verificar si el usuario es cliente
function isCliente(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  if (req.session.userRole !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de cliente' });
  }
  
  return next();
}

// Middleware para verificar si el usuario tiene uno de los roles permitidos
function hasRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (!allowedRoles.includes(req.session.userRole)) {
      return res.status(403).json({ error: 'Acceso denegado. No tienes permisos para esta acción' });
    }
    
    return next();
  };
}

module.exports = {
  isAuthenticated,
  isAdmin,
  isCliente,
  hasRole
};
