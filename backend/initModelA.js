const ModelConfig = require('./models/modelconfig');
const sequelize = require('./sequelize');

const initializeDefaultModelA = async () => {
  try {
    // Verificar si ya existe configuración
    const existingConfigs = await ModelConfig.findAll({
      where: { modelType: 'A' }
    });

    if (existingConfigs.length > 0) {
      console.log('Configuración del Modelo A ya existe.');
      return;
    }

    // Insertar configuración por defecto
    const defaultSymbols = [
      { symbolId: 'cherry', symbolName: 'Cereza', emoji: '🍒', probability: 0.30, multiplier: 2, type: 'Común' },
      { symbolId: 'lemon', symbolName: 'Limón', emoji: '🍋', probability: 0.25, multiplier: 3, type: 'Común' },
      { symbolId: 'orange', symbolName: 'Naranja', emoji: '🍊', probability: 0.20, multiplier: 5, type: 'Medio' },
      { symbolId: 'watermelon', symbolName: 'Sandía', emoji: '🍉', probability: 0.12, multiplier: 8, type: 'Medio' },
      { symbolId: 'star', symbolName: 'Estrella', emoji: '⭐', probability: 0.08, multiplier: 15, type: 'Raro' },
      { symbolId: 'diamond', symbolName: 'Diamante', emoji: '💎', probability: 0.04, multiplier: 50, type: 'Muy Raro' },
      { symbolId: 'seven', symbolName: 'Siete', emoji: '7️⃣', probability: 0.01, multiplier: 100, type: 'Jackpot' }
    ];

    await ModelConfig.bulkCreate(
      defaultSymbols.map(s => ({ 
        ...s, 
        modelType: 'A', 
        active: true, 
        rtpTarget: 95 
      }))
    );

    console.log('✅ Configuración por defecto del Modelo A insertada correctamente.');
  } catch (error) {
    console.error('Error inicializando configuración del Modelo A:', error);
  }
};

// Ejecutar inicialización
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
    return sequelize.sync();
  })
  .then(() => {
    return initializeDefaultModelA();
  })
  .then(() => {
    console.log('Inicialización completada.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
