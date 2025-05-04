const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  replyID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'help', 'feedback', 'announcement'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastReply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  },
  lastReplyAt: {
    type: Date
  },
  replies: [replySchema]
}, {
  timestamps: true
});

// Indexes for efficient querying
threadSchema.index({ author: 1 });
threadSchema.index({ category: 1 });
threadSchema.index({ tags: 1 });
threadSchema.index({ createdAt: -1 });
threadSchema.index({ lastReplyAt: -1 });

module.exports = mongoose.model('Thread', threadSchema); 