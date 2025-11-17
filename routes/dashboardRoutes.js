const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');

// Protect dashboard with session-based login
function protect(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

// GET /dashboard
router.get('/', protect, getDashboard);

module.exports = router;
