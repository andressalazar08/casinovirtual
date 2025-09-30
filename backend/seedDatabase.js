const sequelize = require('./sequelize');
const Symbol = require('./models/symbol');

async function seedDatabase() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync();
    console.log('Tablas sincronizadas.');

    // Verificar si ya hay símbolos
    const existingSymbols = await Symbol.count();
    if (existingSymbols > 0) {
      console.log('Los símbolos ya existen en la base de datos.');
      return;
    }

    // Crear símbolos iniciales
    const symbols = [
      { name: '🍒', image: 'cherry.png', payoutMultiplier: 2.0 },
      { name: '🍋', image: 'lemon.png', payoutMultiplier: 3.0 },
      { name: '🍊', image: 'orange.png', payoutMultiplier: 4.0 },
      { name: '🍉', image: 'watermelon.png', payoutMultiplier: 5.0 },
      { name: '⭐', image: 'star.png', payoutMultiplier: 8.0 },
      { name: '💎', image: 'diamond.png', payoutMultiplier: 15.0 },
      { name: '7️⃣', image: 'seven.png', payoutMultiplier: 25.0 }
    ];

    await Symbol.bulkCreate(symbols);
    console.log('Símbolos creados exitosamente.');

  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;