const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

// Create a new thread
exports.createThread = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const thread = await Thread.create({
      title,
      content,
      author: req.user.id,
      category,
      tags
    });
    res.status(201).json(thread);
  } catch (error) {
    res.status(400).json({ message: 'Error creating thread', error: error.message });
  }
};

// Get all threads with pagination
exports.getThreads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;

    const query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const threads = await Thread.find(query)
      .sort({ isPinned: -1, lastReplyAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'userName icon')
      .populate('lastReply');

    const total = await Thread.countDocuments(query);

    res.json({
      threads,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalThreads: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching threads', error: error.message });
  }
};

// Get a single thread by ID
exports.getThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate('author', 'userName icon')
      .populate('lastReply');

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Increment view count
    thread.viewCount += 1;
    await thread.save();

    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thread', error: error.message });
  }
};

// Update a thread
exports.updateThread = async (req, res) => {
  try {
    const { title, content, category, tags, isPinned, isLocked } = req.body;
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if user is the author or has admin privileges
    if (thread.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this thread' });
    }

    thread.title = title || thread.title;
    thread.content = content || thread.content;
    thread.category = category || thread.category;
    thread.tags = tags || thread.tags;
    if (typeof isPinned !== 'undefined') thread.isPinned = isPinned;
    if (typeof isLocked !== 'undefined') thread.isLocked = isLocked;

    await thread.save();
    res.json(thread);
  } catch (error) {
    res.status(400).json({ message: 'Error updating thread', error: error.message });
  }
};

// Delete a thread
exports.deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    // Check if user is the author or has admin privileges
    if (thread.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }

    // Delete all replies associated with the thread
    await Reply.deleteMany({ thread: thread._id });
    await Thread.findByIdAndDelete(thread._id);

    res.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting thread', error: error.message });
  }
}; 