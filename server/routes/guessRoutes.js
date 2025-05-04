const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  makeGuess,
  getPostGuesses,
  getUserGuesses,
  getUserStats
} = require('../controllers/guessController');

// All routes require authentication
router.use(auth);

// Make a guess about a post
router.post('/posts/:postId', makeGuess);

// Get all guesses for a post
router.get('/posts/:postId', getPostGuesses);

// Get all guesses by the current user
router.get('/user', getUserGuesses);

// Get user's guess statistics
router.get('/user/stats', getUserStats);

module.exports = router; 