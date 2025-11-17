const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();
    const totalOrders = await Order.count();

    const orders = await Order.findAll({ attributes: ['total_price'] });
    const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

    res.render('dashboard', {
      title: 'Admin Dashboard',
      user: req.session.user, // attach logged-in user
      stats: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalSales
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard.');
  }
};
