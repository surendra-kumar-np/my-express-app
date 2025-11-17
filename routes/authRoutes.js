const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Web routes (EJS)
router.get('/login', authController.showLogin);
router.get('/register', authController.showRegister);
router.post('/login', authController.loginUserWeb);
router.post('/register', authController.registerUser);
router.get('/logout', authController.logout);

// API route
router.post('/login-api', authController.loginUserAPI);

module.exports = router;