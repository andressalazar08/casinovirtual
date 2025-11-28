const bcrypt = require('bcrypt');
const User = require('../models/user');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validar que el role sea válido
    const validRoles = ['admin', 'cliente'];
    const userRole = role && validRoles.includes(role) ? role : 'cliente';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      role: userRole 
    });
    
    res.status(201).json({ 
      message: 'Usuario registrado', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    // Verificar si el usuario está activo
    if (!user.activo) return res.status(403).json({ error: 'Usuario inactivo' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
    
    req.session.userId = user.id;
    req.session.userRole = user.role; // Guardar el rol en la sesión
    
    res.json({ 
      message: 'Login exitoso', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role,
        saldo: user.saldo 
      } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout de usuario
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ message: 'Logout exitoso' });
  });
};

// Verificar sesión actual
exports.checkSession = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'No hay sesión activa' });
    }
    
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role,
        saldo: user.saldo 
      } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.session.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
