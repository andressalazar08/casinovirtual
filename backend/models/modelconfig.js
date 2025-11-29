const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ModelConfig = sequelize.define('ModelConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  modelType: {
    type: DataTypes.ENUM('A', 'D'),
    allowNull: false,
    comment: 'Tipo de modelo: A (Distribución Ponderada) o D (Sistema de Rachas)'
  },
  symbolId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'ID del símbolo: cherry, lemon, orange, watermelon, star, diamond, seven'
  },
  symbolName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Nombre del símbolo en español'
  },
  emoji: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Emoji del símbolo'
  },
  probability: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
    defaultValue: 0.14285714, // 1/7 por defecto
    comment: 'Probabilidad de aparición del símbolo (0-1)'
  },
  multiplier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: 'Multiplicador de ganancia para 5 símbolos iguales'
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Común',
    comment: 'Tipo/categoría del símbolo'
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Si el símbolo está activo en el juego'
  },
  rtpTarget: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'RTP objetivo configurado (solo se guarda una vez por modelo)'
  }
}, {
  tableName: 'model_configs',
  timestamps: true
});

module.exports = ModelConfig;
