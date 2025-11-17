const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: 'OrderItems', timestamps: true });

OrderItem.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'SET NULL' });

module.exports = OrderItem;
