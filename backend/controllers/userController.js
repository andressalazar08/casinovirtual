const User = require('../models/user');

// Listar todos los usuarios activos
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { activo: true },
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar datos básicos del usuario (username, email)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const user = await User.findByPk(id);
    if (!user || !user.activo) return res.status(404).json({ error: 'Usuario no encontrado' });
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    res.json({ message: 'Usuario actualizado', user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Desactivar lógicamente un usuario
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user || !user.activo) return res.status(404).json({ error: 'Usuario no encontrado' });
    user.activo = false;
    await user.save();
    res.json({ message: 'Usuario desactivado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
