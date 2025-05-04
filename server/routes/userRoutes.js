const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get current user's profile
router.get('/profile', auth, userController.getProfile);

// Get user profile by ID
router.get('/:id', auth, userController.getUserProfile);

// Update user profile
router.patch('/:id', auth, userController.updateUserProfile);

module.exports = router; 