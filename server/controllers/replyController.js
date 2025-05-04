const Reply = require('../models/Reply');
const Thread = require('../models/Thread');

// Create a new reply
exports.createReply = async (req, res) => {
  try {
    const { content, parentReply } = req.body;
    const threadId = req.params.threadId;

    // Check if thread exists and is not locked
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    if (thread.isLocked) {
      return res.status(403).json({ message: 'Thread is locked' });
    }

    // Create the reply
    const reply = await Reply.create({
      content,
      author: req.user.id,
      thread: threadId,
      parentReply
    });

    // Update thread's last reply
    thread.lastReply = reply._id;
    thread.lastReplyAt = new Date();
    await thread.save();

    // Populate author and parent reply if exists
    await reply.populate('author', 'userName icon');
    if (parentReply) {
      await reply.populate('parentReply');
    }

    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ message: 'Error creating reply', error: error.message });
  }
};

// Get replies for a thread
exports.getReplies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const threadId = req.params.threadId;

    const replies = await Reply.find({ thread: threadId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'userName icon')
      .populate('parentReply')
      .populate('likes', 'userName icon');

    const total = await Reply.countDocuments({ thread: threadId });

    res.json({
      replies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReplies: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching replies', error: error.message });
  }
};

// Update a reply
exports.updateReply = async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user is the author
    if (reply.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this reply' });
    }

    reply.content = content;
    reply.isEdited = true;
    reply.editedAt = new Date();
    await reply.save();

    res.json(reply);
  } catch (error) {
    res.status(400).json({ message: 'Error updating reply', error: error.message });
  }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user is the author or has admin privileges
    if (reply.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    // Update thread's last reply if this was the last reply
    const thread = await Thread.findById(reply.thread);
    if (thread.lastReply.toString() === reply._id.toString()) {
      const previousReply = await Reply.findOne({ thread: thread._id, _id: { $ne: reply._id } })
        .sort({ createdAt: -1 });
      
      thread.lastReply = previousReply ? previousReply._id : null;
      thread.lastReplyAt = previousReply ? previousReply.createdAt : null;
      await thread.save();
    }

    await Reply.findByIdAndDelete(reply._id);
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reply', error: error.message });
  }
};

// Like/unlike a reply
exports.toggleLike = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const userId = req.user.id;
    const likeIndex = reply.likes.indexOf(userId);

    if (likeIndex === -1) {
      reply.likes.push(userId);
    } else {
      reply.likes.splice(likeIndex, 1);
    }

    await reply.save();
    res.json(reply);
  } catch (error) {
    res.status(400).json({ message: 'Error toggling like', error: error.message });
  }
}; 