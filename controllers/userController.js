const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.render('users/index', {
      title: 'User List',
      layout: 'layouts/main',
      users,
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading users.');
  }
};

exports.showAddUser = (req, res) => {
  res.render('users/add', {
    title: 'Add User',
    layout: 'layouts/main',
    user: req.session.user,
    error: null
  });
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    if (!name || !email || !password) throw new Error('All fields are required');

    const existing = await User.findOne({ where: { email } });
    if (existing) throw new Error('Email already exists');

    await User.create({ name, email, password, role_id });
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.render('users/add', {
      title: 'Add User',
      layout: 'layouts/main',
      user: req.session.user,
      error: err.message
    });
  }
};

exports.showEditUser = async (req, res) => {
  try {
    const userToEdit = await User.findByPk(req.params.id);
    if (!userToEdit) return res.redirect('/users');

    res.render('users/edit', {
      title: 'Edit User',
      layout: 'layouts/main',
      user: req.session.user,
      editUser: userToEdit,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const userToEdit = await User.findByPk(req.params.id);
    if (!userToEdit) return res.redirect('/users');

    if (password) userToEdit.password = await bcrypt.hash(password, 10);
    userToEdit.name = name;
    userToEdit.email = email;
    userToEdit.role_id = role_id;

    await userToEdit.save();
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findByPk(req.params.id);
    if (!userToDelete) return res.redirect('/users');

    await userToDelete.destroy();
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.redirect('/users');
  }
};
