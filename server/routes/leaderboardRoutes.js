const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getGlobalLeaderboard,
  getUserLeaderboardPosition,
  getStreakLeaderboard,
  getAccuracyLeaderboard
} = require('../controllers/leaderboardController');

// All routes require authentication
router.use(auth);

// Get global leaderboard
router.get('/global', getGlobalLeaderboard);

// Get user's leaderboard position
router.get('/user', getUserLeaderboardPosition);

// Get streak leaderboard
router.get('/streak', getStreakLeaderboard);

// Get accuracy leaderboard
router.get('/accuracy', getAccuracyLeaderboard);

module.exports = router; 