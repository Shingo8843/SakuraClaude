const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

// Update leaderboard when a guess is made
exports.updateLeaderboard = async (userId, points, isCorrect) => {
  try {
    let leaderboardEntry = await Leaderboard.findOne({ user: userId });

    if (!leaderboardEntry) {
      leaderboardEntry = await Leaderboard.create({ user: userId });
    }

    // Update basic stats
    leaderboardEntry.totalPoints += points;
    leaderboardEntry.totalGuesses += 1;
    if (isCorrect) {
      leaderboardEntry.correctGuesses += 1;
    }
    leaderboardEntry.accuracy = (leaderboardEntry.correctGuesses / leaderboardEntry.totalGuesses) * 100;

    // Update streak
    const today = new Date();
    const lastGuessDate = leaderboardEntry.lastGuessDate;
    
    if (lastGuessDate) {
      const daysSinceLastGuess = Math.floor((today - lastGuessDate) / (1000 * 60 * 60 * 24));
      if (daysSinceLastGuess === 1) {
        leaderboardEntry.streak += 1;
      } else if (daysSinceLastGuess > 1) {
        leaderboardEntry.streak = 1;
      }
    } else {
      leaderboardEntry.streak = 1;
    }

    leaderboardEntry.lastGuessDate = today;
    await leaderboardEntry.save();

    // Update ranks for all users
    await updateRanks();
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

// Update ranks for all users
const updateRanks = async () => {
  try {
    const leaderboardEntries = await Leaderboard.find()
      .sort({ totalPoints: -1 })
      .select('_id');

    for (let i = 0; i < leaderboardEntries.length; i++) {
      await Leaderboard.findByIdAndUpdate(leaderboardEntries[i]._id, { rank: i + 1 });
    }
  } catch (error) {
    console.error('Error updating ranks:', error);
  }
};

// Get global leaderboard
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await Leaderboard.find()
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'userName icon');

    const total = await Leaderboard.countDocuments();

    res.json({
      leaderboard,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEntries: total
    });
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    res.status(500).json({ message: 'Error getting global leaderboard', error: error.message });
  }
};

// Get user's leaderboard position
exports.getUserLeaderboardPosition = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaderboardEntry = await Leaderboard.findOne({ user: userId })
      .populate('user', 'userName icon');

    if (!leaderboardEntry) {
      return res.json({
        message: 'No leaderboard entry found for user',
        rank: null,
        totalPoints: 0,
        totalGuesses: 0,
        accuracy: 0,
        streak: 0
      });
    }

    res.json(leaderboardEntry);
  } catch (error) {
    console.error('Error getting user leaderboard position:', error);
    res.status(500).json({ message: 'Error getting user leaderboard position', error: error.message });
  }
};

// Get leaderboard by streak
exports.getStreakLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await Leaderboard.find()
      .sort({ streak: -1, totalPoints: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'userName icon');

    const total = await Leaderboard.countDocuments();

    res.json({
      leaderboard,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEntries: total
    });
  } catch (error) {
    console.error('Error getting streak leaderboard:', error);
    res.status(500).json({ message: 'Error getting streak leaderboard', error: error.message });
  }
};

// Get leaderboard by accuracy
exports.getAccuracyLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await Leaderboard.find({ totalGuesses: { $gte: 10 } }) // Only show users with at least 10 guesses
      .sort({ accuracy: -1, totalPoints: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'userName icon');

    const total = await Leaderboard.countDocuments({ totalGuesses: { $gte: 10 } });

    res.json({
      leaderboard,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEntries: total
    });
  } catch (error) {
    console.error('Error getting accuracy leaderboard:', error);
    res.status(500).json({ message: 'Error getting accuracy leaderboard', error: error.message });
  }
}; 