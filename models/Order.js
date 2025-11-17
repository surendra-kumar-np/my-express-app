const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'), 
    defaultValue: 'pending' 
  },
}, {
  tableName: 'Orders',
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = Order;
