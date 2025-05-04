const Guess = require('../models/Guess');
const Post = require('../models/Post');
const User = require('../models/User');
const { updateLeaderboard } = require('./leaderboardController');

// Make a guess about a post
exports.makeGuess = async (req, res) => {
  try {
    const { postId } = req.params;
    const { guessedIsAgent, confidence, reasoning } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user has already guessed this post
    const existingGuess = await Guess.findOne({ user: userId, post: postId });
    if (existingGuess) {
      return res.status(400).json({ message: 'You have already guessed this post' });
    }

    // Calculate if the guess is correct
    const isCorrect = guessedIsAgent === post.isAgentGenerated;

    // Calculate points based on confidence and correctness
    let points = 0;
    if (isCorrect) {
      // More points for higher confidence when correct
      points = Math.floor(confidence / 10) * 10;
    } else {
      // Penalty for high confidence when wrong
      points = -Math.floor(confidence / 20) * 10;
    }

    // Create the guess
    const guess = await Guess.create({
      user: userId,
      post: postId,
      guessedIsAgent,
      isCorrect,
      confidence,
      reasoning,
      points
    });

    // Add guess to user's guesses array
    await User.findByIdAndUpdate(userId, {
      $push: { guesses: guess._id }
    });

    // Update leaderboard
    await updateLeaderboard(userId, points, isCorrect);

    res.status(201).json(guess);
  } catch (error) {
    console.error('Error making guess:', error);
    res.status(500).json({ message: 'Error making guess', error: error.message });
  }
};

// Get all guesses for a post
exports.getPostGuesses = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const guesses = await Guess.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'userName icon');

    const total = await Guess.countDocuments({ post: postId });

    res.json({
      guesses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalGuesses: total
    });
  } catch (error) {
    console.error('Error getting post guesses:', error);
    res.status(500).json({ message: 'Error getting post guesses', error: error.message });
  }
};

// Get all guesses by a user
exports.getUserGuesses = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const guesses = await Guess.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('post', 'content isAgentGenerated');

    const total = await Guess.countDocuments({ user: userId });

    res.json({
      guesses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalGuesses: total
    });
  } catch (error) {
    console.error('Error getting user guesses:', error);
    res.status(500).json({ message: 'Error getting user guesses', error: error.message });
  }
};

// Get user's guess statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Guess.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalGuesses: { $sum: 1 },
          correctGuesses: { $sum: { $cond: ['$isCorrect', 1, 0] } },
          totalPoints: { $sum: '$points' },
          averageConfidence: { $avg: '$confidence' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalGuesses: 0,
        correctGuesses: 0,
        accuracy: 0,
        totalPoints: 0,
        averageConfidence: 0
      });
    }

    const { totalGuesses, correctGuesses, totalPoints, averageConfidence } = stats[0];
    const accuracy = (correctGuesses / totalGuesses) * 100;

    res.json({
      totalGuesses,
      correctGuesses,
      accuracy,
      totalPoints,
      averageConfidence
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ message: 'Error getting user stats', error: error.message });
  }
}; 