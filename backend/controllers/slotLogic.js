const Symbol = require('../models/symbol');

/**
 * Genera un arreglo de símbolos aleatorios para los rodillos de la tragamonedas.
 * Compatible con el frontend: 5 rodillos con 5 símbolos cada uno.
 * @param {number} reels - Número de rodillos (por defecto 5).
 * @param {number} symbolsPerReel - Número de símbolos por rodillo (por defecto 5).
 * @param {Array} availableSymbols - Lista de símbolos posibles.
 * @returns {Array} Matriz de símbolos seleccionados por rodillo.
 */
async function generateRandomReels(reels = 5, symbolsPerReel = 5, availableSymbols = null) {
  // Símbolos fijos que coinciden con el frontend
  const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '7️⃣'];
  
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
 * Compatible con el frontend: verifica posición 2 (línea media) de 5 rodillos.
 * @param {Array} reels - Matriz de símbolos generados por los rodillos.
 * @param {number} betAmount - Monto apostado.
 * @returns {Object} Resultado con información de ganancia y combinación.
 */
function checkWinningLine(reels, betAmount) {
  // Línea central: posición 2 de cada rodillo (coincide con frontend)
  const line = reels.map(reel => reel[2]);
  // Si todos los símbolos son iguales, es ganador
  const allSame = line.every(s => s === line[0]);
  
  if (allSame) {
    // Multiplicador fijo de 10x (coincide con frontend)
    const payout = betAmount * 10;
    return { win: true, payout, line, winSymbol: line[0] };
  }
  
  return { win: false, payout: 0, line };
}

module.exports = {
  generateRandomReels,
  checkWinningLine
};
