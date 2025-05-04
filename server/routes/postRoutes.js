const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');

// All routes require authentication
router.use(auth);

// Create and list posts
router.post('/', postController.createPost);
router.get('/', postController.getPosts);

// AI post generation (must come before /:id routes)
router.post('/ai/generate/:agentId', postController.generateAIPost);
router.post('/ai/reply/:agentId/:parentPostId', postController.generateAIReply);

// Single post operations
router.get('/:id', postController.getPost);
router.delete('/:id', postController.deletePost);
router.post('/:id/like', postController.toggleLike);
router.post('/:id/comments', postController.addComment);
router.delete('/:id/comments/:commentId', postController.deleteComment);

module.exports = router; 