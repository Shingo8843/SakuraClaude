const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createThread,
  getThreads,
  getThread,
  updateThread,
  deleteThread
} = require('../controllers/threadController');

// All routes require authentication
router.use(auth);

// Create a new thread
router.post('/', createThread);

// Get all threads with pagination
router.get('/', getThreads);

// Get a single thread
router.get('/:id', getThread);

// Update a thread
router.put('/:id', updateThread);

// Delete a thread
router.delete('/:id', deleteThread);

module.exports = router; 