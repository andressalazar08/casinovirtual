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

// Recargar saldo del usuario
exports.rechargeBalance = async (req, res) => {
  try {
    const userId = req.userId; // ID del usuario autenticado desde el middleware
    const { amount, cardNumber, cardExp, cardCvv } = req.body;

    // Validaciones
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    if (!cardNumber || cardNumber.length !== 16) {
      return res.status(400).json({ error: 'Número de tarjeta inválido' });
    }

    if (!cardExp || !/^\d{2}\/\d{2}$/.test(cardExp)) {
      return res.status(400).json({ error: 'Fecha de expiración inválida (MM/YY)' });
    }

    if (!cardCvv || cardCvv.length !== 3) {
      return res.status(400).json({ error: 'CVV inválido' });
    }

    // Buscar usuario
    const user = await User.findByPk(userId);
    if (!user || !user.activo) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Aquí en producción se haría la validación con la pasarela de pago
    // Por ahora simulamos que el pago fue exitoso

    // Actualizar saldo
    const previousBalance = parseFloat(user.saldo) || 0;
    const newBalance = previousBalance + parseFloat(amount);
    user.saldo = newBalance;
    await user.save();

    res.json({
      message: 'Recarga exitosa',
      previousBalance: previousBalance.toFixed(2),
      rechargedAmount: parseFloat(amount).toFixed(2),
      newBalance: newBalance.toFixed(2),
      user: {
        id: user.id,
        username: user.username,
        saldo: newBalance
      }
    });
  } catch (error) {
    console.error('Error en recarga de saldo:', error);
    res.status(500).json({ error: 'Error al procesar la recarga' });
  }
};
