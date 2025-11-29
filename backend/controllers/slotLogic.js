const Symbol = require('../models/symbol');
const ModelConfig = require('../models/modelconfig');

/**
 * Genera un arreglo de símbolos aleatorios para los rodillos de la tragamonedas.
 * Compatible con el frontend: 5 rodillos con 5 símbolos cada uno.
 * Usa las probabilidades configuradas en el Modelo A.
 * @param {number} reels - Número de rodillos (por defecto 5).
 * @param {number} symbolsPerReel - Número de símbolos por rodillo (por defecto 5).
 * @param {Array} configSymbols - Configuración de símbolos desde la BD (opcional).
 * @returns {Array} Matriz de símbolos seleccionados por rodillo.
 */
async function generateRandomReels(reels = 5, symbolsPerReel = 5, configSymbols = null) {
  let symbolsConfig;

  // Si no se pasa configuración, obtenerla de la BD
  if (!configSymbols) {
    const configs = await ModelConfig.findAll({
      where: { modelType: 'A', active: true },
      order: [['id', 'ASC']]
    });

    console.log('Configuraciones cargadas desde BD:', configs.length); // Debug

    if (configs.length === 0) {
      // Fallback a símbolos por defecto con probabilidad uniforme
      const defaultSymbols = ['cherry', 'lemon', 'orange', 'watermelon', 'star', 'diamond', 'seven'];
      const uniformProb = 1 / defaultSymbols.length;
      
      symbolsConfig = defaultSymbols.map(id => ({
        symbolId: id,
        probability: uniformProb
      }));
      console.log('Usando probabilidades por defecto (uniforme)'); // Debug
    } else {
      symbolsConfig = configs.map(c => ({
        symbolId: c.symbolId,
        probability: parseFloat(c.probability)
      }));
      console.log('Probabilidades configuradas:', symbolsConfig); // Debug
    }
  } else {
    symbolsConfig = configSymbols;
  }

  // Crear una función de selección ponderada
  const selectWeightedSymbol = () => {
    const random = Math.random();
    let cumulative = 0;
    
    for (const symbol of symbolsConfig) {
      cumulative += symbol.probability;
      if (random <= cumulative) {
        return symbol.symbolId;
      }
    }
    
    // Fallback por si hay error de redondeo
    return symbolsConfig[symbolsConfig.length - 1].symbolId;
  };

  // Generar los rodillos usando las probabilidades
  const result = [];
  for (let i = 0; i < reels; i++) {
    const reel = [];
    for (let j = 0; j < symbolsPerReel; j++) {
      reel.push(selectWeightedSymbol());
    }
    result.push(reel);
  }
  
  return result;
}

/**
 * Verifica si hay una combinación ganadora en la línea central de los rodillos.
 * Compatible con el frontend: verifica posición 2 (línea media) de 5 rodillos.
 * Usa los multiplicadores configurados en el Modelo A.
 * @param {Array} reels - Matriz de símbolos generados por los rodillos.
 * @param {number} betAmount - Monto apostado.
 * @returns {Object} Resultado con información de ganancia y combinación.
 */
async function checkWinningLine(reels, betAmount) {
  // Línea central: posición 2 de cada rodillo (coincide con frontend)
  const line = reels.map(reel => reel[2]);
  // Si todos los símbolos son iguales, es ganador
  const allSame = line.every(s => s === line[0]);
  
  if (allSame) {
    // Obtener multiplicador configurado para este símbolo
    const winSymbolId = line[0];
    const config = await ModelConfig.findOne({
      where: { 
        modelType: 'A', 
        symbolId: winSymbolId,
        active: true 
      }
    });

    // Si no hay configuración, usar multiplicador por defecto de 10x
    const multiplier = config ? config.multiplier : 10;
    const payout = betAmount * multiplier;
    
    return { win: true, payout, line, winSymbol: winSymbolId, multiplier };
  }
  
  return { win: false, payout: 0, line };
}

module.exports = {
  generateRandomReels,
  checkWinningLine
};
