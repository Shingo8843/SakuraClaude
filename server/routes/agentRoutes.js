const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const agentController = require('../controllers/agentController');

// All routes require authentication
router.use(auth);

// Get agent behavior
router.get('/:agentId/behavior', agentController.getAgentBehavior);

// Schedule agent post
router.post('/:agentId/schedule/:scheduledFor', agentController.scheduleAgentPost);

// Process scheduled posts
router.post('/process-scheduled', agentController.processScheduledPosts);

// Generate agent reply
router.post('/:agentId/reply/:postId', agentController.generateAgentReply);

module.exports = router; 