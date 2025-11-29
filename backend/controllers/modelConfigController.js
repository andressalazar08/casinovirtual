const ModelConfig = require('../models/modelconfig');

// Obtener configuración del Modelo A
exports.getModelAConfig = async (req, res) => {
  try {
    let configs = await ModelConfig.findAll({
      where: { modelType: 'A', active: true },
      order: [['id', 'ASC']]
    });

    // Si no existe configuración, crear la configuración por defecto
    if (configs.length === 0) {
      const defaultSymbols = [
        { symbolId: 'cherry', symbolName: 'Cereza', emoji: '🍒', probability: 0.30, multiplier: 2, type: 'Común' },
        { symbolId: 'lemon', symbolName: 'Limón', emoji: '🍋', probability: 0.25, multiplier: 3, type: 'Común' },
        { symbolId: 'orange', symbolName: 'Naranja', emoji: '🍊', probability: 0.20, multiplier: 5, type: 'Medio' },
        { symbolId: 'watermelon', symbolName: 'Sandía', emoji: '🍉', probability: 0.12, multiplier: 8, type: 'Medio' },
        { symbolId: 'star', symbolName: 'Estrella', emoji: '⭐', probability: 0.08, multiplier: 15, type: 'Raro' },
        { symbolId: 'diamond', symbolName: 'Diamante', emoji: '💎', probability: 0.04, multiplier: 50, type: 'Muy Raro' },
        { symbolId: 'seven', symbolName: 'Siete', emoji: '7️⃣', probability: 0.01, multiplier: 100, type: 'Jackpot' }
      ];

      configs = await ModelConfig.bulkCreate(
        defaultSymbols.map(s => ({ ...s, modelType: 'A', active: true, rtpTarget: 95 }))
      );
    }

    // Obtener RTP objetivo del primer símbolo (todos comparten el mismo)
    const rtpTarget = configs[0]?.rtpTarget || 95;

    res.json({
      symbols: configs.map(c => ({
        id: c.id,
        symbolId: c.symbolId,
        symbolName: c.symbolName,
        emoji: c.emoji,
        probability: parseFloat(c.probability),
        multiplier: c.multiplier,
        type: c.type,
        active: c.active
      })),
      rtpTarget: parseFloat(rtpTarget)
    });
  } catch (error) {
    console.error('Error obteniendo configuración Modelo A:', error);
    res.status(500).json({ error: 'Error al obtener configuración del Modelo A' });
  }
};

// Guardar configuración del Modelo A
exports.saveModelAConfig = async (req, res) => {
  try {
    const { symbols, rtpTarget } = req.body;

    console.log('=== GUARDANDO CONFIGURACIÓN MODELO A ===');
    console.log('Símbolos recibidos:', symbols);
    console.log('RTP Target:', rtpTarget);

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Datos de símbolos inválidos' });
    }

    // Validar que las probabilidades sumen 1.0 (con margen de error)
    const sumaProbabilidades = symbols.reduce((sum, s) => sum + s.probability, 0);
    console.log('Suma de probabilidades:', sumaProbabilidades);
    
    if (Math.abs(sumaProbabilidades - 1.0) > 0.001) {
      return res.status(400).json({ 
        error: 'Las probabilidades deben sumar 1.0', 
        suma: sumaProbabilidades 
      });
    }

    // Actualizar o crear cada símbolo
    const promises = symbols.map(async (symbol) => {
      const [config, created] = await ModelConfig.findOrCreate({
        where: { 
          modelType: 'A',
          symbolId: symbol.symbolId
        },
        defaults: {
          symbolName: symbol.symbolName || symbol.nombre,
          emoji: symbol.emoji,
          probability: symbol.probability !== undefined ? symbol.probability : (symbol.probabilidad !== undefined ? symbol.probabilidad : 0),
          multiplier: symbol.multiplier || symbol.multiplicador || 10,
          type: symbol.type || symbol.tipo,
          active: true,
          rtpTarget: rtpTarget || 95
        }
      });

      if (!created) {
        config.symbolName = symbol.symbolName || symbol.nombre;
        config.emoji = symbol.emoji;
        config.probability = symbol.probability !== undefined ? symbol.probability : (symbol.probabilidad !== undefined ? symbol.probabilidad : 0);
        config.multiplier = symbol.multiplier || symbol.multiplicador || 10;
        config.type = symbol.type || symbol.tipo;
        config.rtpTarget = rtpTarget || 95;
        await config.save();
      }

      return config;
    });

    const results = await Promise.all(promises);
    
    console.log('Configuración guardada exitosamente. Registros actualizados:', results.length);

    res.json({ 
      message: 'Configuración del Modelo A guardada correctamente',
      success: true
    });
  } catch (error) {
    console.error('Error guardando configuración Modelo A:', error);
    res.status(500).json({ error: 'Error al guardar configuración del Modelo A' });
  }
};

// Obtener configuración activa para el juego
exports.getActiveGameConfig = async (req, res) => {
  try {
    const configs = await ModelConfig.findAll({
      where: { modelType: 'A', active: true },
      order: [['probability', 'DESC']]
    });

    if (configs.length === 0) {
      return res.status(404).json({ error: 'No hay configuración activa' });
    }

    res.json({
      symbols: configs.map(c => ({
        symbolId: c.symbolId,
        probability: parseFloat(c.probability),
        multiplier: c.multiplier
      })),
      rtpTarget: parseFloat(configs[0].rtpTarget)
    });
  } catch (error) {
    console.error('Error obteniendo configuración activa:', error);
    res.status(500).json({ error: 'Error al obtener configuración activa' });
  }
};
