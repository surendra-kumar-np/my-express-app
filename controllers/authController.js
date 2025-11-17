// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Show Login Page
exports.showLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login', 
    layout: 'layouts/auth',
    error: null 
  });
};

// Show Register Page
exports.showRegister = (req, res) => {
  res.render('auth/register', { 
    title: 'Register', 
    layout: 'layouts/auth',
    error: null 
  });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render('auth/register', { 
        title: 'Register', 
        layout: 'layouts/auth', 
        error: 'All fields are required.' 
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('auth/register', { 
        title: 'Register', 
        layout: 'layouts/auth', 
        error: 'Email already registered.' 
      });
    }

    await User.create({ name, email, password });
    res.redirect('/auth/login');
  } catch (err) {
    console.error('❌ Register Error:', err);
    res.render('auth/register', { 
      title: 'Register', 
      layout: 'layouts/auth', 
      error: 'Something went wrong during registration.' 
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token in response
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id } });
    
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginUserWeb = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Login',
        layout: 'layouts/auth',
        error: 'Please enter email and password',
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.render('auth/login', {
        title: 'Login',
        layout: 'layouts/auth',
        error: 'Invalid email or password',
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.render('auth/login', {
        title: 'Login',
        layout: 'layouts/auth',
        error: 'Invalid email or password',
      });

    // Store in session
    req.session.user = { id: user.id, name: user.name, role_id: user.role_id };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('auth/login', {
      title: 'Login',
      layout: 'layouts/auth',
      error: 'Something went wrong',
    });
  }
};


exports.loginUserAPI = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
