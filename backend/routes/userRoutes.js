const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController.js');

// Route for registering a user
router.post('/register', registerUser);

// Route for logging in a user
router.post('/login', loginUser);

module.exports = router;