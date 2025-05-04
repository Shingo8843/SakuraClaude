const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createReply,
  getReplies,
  updateReply,
  deleteReply,
  toggleLike
} = require('../controllers/replyController');

// All routes require authentication
router.use(auth);

// Create a new reply
router.post('/thread/:threadId', createReply);

// Get replies for a thread
router.get('/thread/:threadId', getReplies);

// Update a reply
router.put('/:id', updateReply);

// Delete a reply
router.delete('/:id', deleteReply);

// Like/unlike a reply
router.post('/:id/like', toggleLike);

module.exports = router; 