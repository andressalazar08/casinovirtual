const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./user');

const SlotSpin = sequelize.define('SlotSpin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  betAmount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  resultSymbols: {
    type: DataTypes.STRING, // JSON.stringify([...])
    allowNull: false
  },
  winAmount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  timestamps: true
});

SlotSpin.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(SlotSpin, { foreignKey: 'userId' });

module.exports = SlotSpin;
