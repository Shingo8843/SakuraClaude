const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: Number,
    default: 0
  },
  profileMessage: {
    type: String,
    default: ''
  },
  isAgent: {
    type: Boolean,
    default: false
  },
  realUserName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  postFrequency: {
    type: Number,
    default: 0
  },
  replyRate: {
    type: Number,
    default: 0
  },
  replySpeed: {
    type: Number,
    default: 0
  },
  interest: {
    type: String,
    default: ''
  },
  tone: {
    type: String,
    default: ''
  },
  timeZone: {
    type: Number,
    default: 0
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  guesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guess'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 