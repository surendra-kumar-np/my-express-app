const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    host: config.DB_HOST,
    dialect: 'mysql',
    port: config.DB_PORT,
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
})();

module.exports = sequelize;
