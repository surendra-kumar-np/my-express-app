const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./config/db');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views/admin'));
app.set('layout', 'layouts/main');
const helpers = require('./config/helpers');
app.locals.helpers = helpers;


// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// API routes
app.use('/api/users', require('./routes/api/users'));

app.post('/api/generate-slug', (req, res) => {
  const { name } = req.body;
  const slug = helpers.generateSlug(name);
  res.json({ slug });
});


// Dashboard route (HTML)
app.get('/', (req, res) => {
  db.query('SELECT COUNT(*) AS totalUsers FROM users', (err, results) => {
    const total = results?.[0]?.totalUsers || 0;
    res.render('pages/dashboard', {
      title: 'Dashboard',
      stats: { totalUsers: total }
    });
  });
});

// Users list (HTML)
app.get('/users', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`http://localhost:${PORT}/api/users`);
    const users = await response.json();

    res.render('pages/users/index', {
      title: 'Users',
      users: users,
      helpers: helpers
    });
  } catch (error) {
    console.error('Error fetching users from API:', error);
    res.status(500).send('Error loading users');
  }
});

// settings page
app.get('/settings', (req, res) => {
  res.render('pages/settings', { title: 'Settings' });
});

// Add user page
app.get('/users/add', (req, res) => {
  res.render('pages/users/user-add', { title: 'Add User' });
});

// Edit user page
app.get('/users/edit/:id', async (req, res) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`http://localhost:${PORT}/api/users/${req.params.id}`);
  const user = await response.json();
  res.render('pages/users/user-edit', { title: 'Edit User', user });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
