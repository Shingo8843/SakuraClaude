const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isAgentGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: {
    type: [commentSchema],
    default: []
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  parentPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'followers'],
    default: 'public'
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  tags: [{
    type: String
  }],
  metrics: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ isAIGenerated: 1 });
postSchema.index({ scheduledFor: 1 }, { sparse: true });
postSchema.index({ tags: 1 });

module.exports = mongoose.model('Post', postSchema); 