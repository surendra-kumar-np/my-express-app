/**
 * Auto migration script to safely sync all Sequelize models
 * Author: Surendra (fixed by GPT-5)
 */

const sequelize = require('./db');

// ✅ Import all models (important: correct order)
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

(async () => {
  try {
    console.log('🔄 Starting Sequelize Auto Migration...');

    // 1️⃣ Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // 2️⃣ Drop & recreate tables (if needed)
    // Use `alter: true` in development to adjust columns without data loss
    // Use `force: true` only if you want to reset tables completely
    await sequelize.sync({ alter: true });

    console.log('✅ All models synced successfully!');
    process.exit(0); // end process
  } catch (err) {
    console.error('❌ Sequelize sync error:', err.message);
    process.exit(1);
  }
})();
