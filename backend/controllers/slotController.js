const SlotSpin = require('../models/slotspin');
const User = require('../models/user');
const Symbol = require('../models/symbol');
const { generateRandomReels, checkWinningLine } = require('./slotLogic');

/**
 * Realiza un giro de tragamonedas para el usuario autenticado.
 * - Verifica saldo suficiente
 * - Genera símbolos aleatorios
 * - Calcula premio
 * - Actualiza saldo y guarda la jugada
 */
exports.spin = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { betAmount } = req.body;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const user = await User.findByPk(userId);
    if (!user || !user.activo) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (Number(user.saldo) < betAmount) return res.status(400).json({ error: 'Saldo insuficiente' });

    // Obtener símbolos disponibles
    const symbols = await Symbol.findAll();
    // Generar rodillos aleatorios
    const reels = await generateRandomReels(3, 3, symbols);
    // Verificar línea ganadora
    const result = checkWinningLine(reels, symbols, betAmount);

    // Actualizar saldo
    user.saldo = Number(user.saldo) - betAmount + result.payout;
    await user.save();

    // Guardar jugada
    await SlotSpin.create({
      userId,
      betAmount,
      resultSymbols: JSON.stringify(reels),
      winAmount: result.payout
    });

    res.json({
      reels,
      win: result.win,
      payout: result.payout,
      saldo: user.saldo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Devuelve el historial de jugadas del usuario autenticado.
 */
exports.history = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const spins = await SlotSpin.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(spins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Devuelve el saldo actual del usuario autenticado.
 */
exports.balance = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ saldo: user.saldo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
