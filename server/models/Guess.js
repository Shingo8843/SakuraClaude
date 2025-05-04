const mongoose = require('mongoose');

const guessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  guessedIsAgent: {
    type: Boolean,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  reasoning: {
    type: String,
    maxLength: 280
  },
  points: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// A user can only make one guess per post
guessSchema.index({ user: 1, post: 1 }, { unique: true });

// Add index for querying user's guesses
guessSchema.index({ user: 1, createdAt: -1 });

// Add index for querying post's guesses
guessSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model('Guess', guessSchema); 