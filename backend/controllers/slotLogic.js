const Symbol = require('../models/symbol');

/**
 * Genera un arreglo de símbolos aleatorios para los rodillos de la tragamonedas.
 * @param {number} reels - Número de rodillos.
 * @param {number} symbolsPerReel - Número de símbolos por rodillo.
 * @param {Array} availableSymbols - Lista de símbolos posibles.
 * @returns {Array} Matriz de símbolos seleccionados por rodillo.
 */
async function generateRandomReels(reels = 3, symbolsPerReel = 3, availableSymbols = null) {
  // Si no se pasan símbolos, obtenerlos de la base de datos
  if (!availableSymbols) {
    availableSymbols = await Symbol.findAll();
  }
  const symbols = availableSymbols.map(s => s.name);
  const result = [];
  for (let i = 0; i < reels; i++) {
    const reel = [];
    for (let j = 0; j < symbolsPerReel; j++) {
      // Selecciona un símbolo aleatorio para cada posición
      const randomIndex = Math.floor(Math.random() * symbols.length);
      reel.push(symbols[randomIndex]);
    }
    result.push(reel);
  }
  return result;
}

/**
 * Verifica si hay una combinación ganadora en la línea central de los rodillos.
 * @param {Array} reels - Matriz de símbolos generados por los rodillos.
 * @param {Array} availableSymbols - Lista de símbolos posibles (con payoutMultiplier).
 * @param {number} betAmount - Monto apostado.
 * @returns {Object} Resultado con información de ganancia y combinación.
 */
function checkWinningLine(reels, availableSymbols, betAmount) {
  // Línea central: posición 1 de cada rodillo
  const line = reels.map(reel => reel[1]);
  // Si todos los símbolos son iguales, es ganador
  const allEqual = line.every(s => s === line[0]);
  if (allEqual) {
    // Buscar el multiplicador del símbolo
    const symbol = availableSymbols.find(sym => sym.name === line[0]);
    const payout = symbol ? Number(symbol.payoutMultiplier) * betAmount : 0;
    return { win: true, payout, line };
  }
  return { win: false, payout: 0, line };
}

module.exports = {
  generateRandomReels,
  checkWinningLine
};
