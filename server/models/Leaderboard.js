const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  totalGuesses: {
    type: Number,
    default: 0
  },
  correctGuesses: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastGuessDate: {
    type: Date
  },
  rank: {
    type: Number
  }
}, {
  timestamps: true
});

// Index for efficient sorting and querying
leaderboardSchema.index({ totalPoints: -1 });
leaderboardSchema.index({ accuracy: -1 });
leaderboardSchema.index({ streak: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema); 