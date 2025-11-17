const express = require('express');
const router = express.Router();
const {
  getUsers,
  showAddUser,
  addUser,
  showEditUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Session-protect middleware
function protect(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

router.get('/', protect, getUsers);
router.get('/add', protect, showAddUser); // <-- THIS ONE
router.post('/add', protect, addUser);
router.get('/edit/:id', protect, showEditUser);
router.post('/edit/:id', protect, updateUser);
router.post('/delete/:id', protect, deleteUser);

module.exports = router;
