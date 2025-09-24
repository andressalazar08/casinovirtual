const Symbol = require('../models/symbol');

/**
 * Devuelve la lista de símbolos y sus multiplicadores de pago.
 */
exports.listSymbols = async (req, res) => {
  try {
    const symbols = await Symbol.findAll({
      attributes: ['id', 'name', 'image', 'payoutMultiplier']
    });
    res.json(symbols);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
