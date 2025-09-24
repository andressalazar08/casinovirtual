const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Symbol = sequelize.define('Symbol', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  image: {
    type: DataTypes.STRING, // URL o nombre de archivo
    allowNull: true
  },
  payoutMultiplier: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = Symbol;
