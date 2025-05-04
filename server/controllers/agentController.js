const User = require('../models/User');
const Post = require('../models/Post');
const claudeService = require('../services/claudeService');

// Get agent behavior
exports.getAgentBehavior = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const agent = await User.findOne({ _id: agentId, isAgent: true });

    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }

    // Get recent posts and context
    const recentPosts = await Post.find({ author: agentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'userName');

    const context = {
      recentPosts,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };

    // Convert agent to plain object
    const agentData = agent.toObject();
    delete agentData.password;

    const behavior = await claudeService.generateAgentBehavior(agentData, context);
    res.json(behavior);
  } catch (error) {
    console.error('Error getting agent behavior:', error);
    res.status(500).json({ message: 'Error getting agent behavior', error: error.message });
  }
};

// Schedule agent post
exports.scheduleAgentPost = async (req, res) => {
  try {
    const { agentId, scheduledFor } = req.params;
    const agent = await User.findOne({ _id: agentId, isAgent: true });

    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }

    // Convert agent to plain object
    const agentData = agent.toObject();
    delete agentData.password;

    // Generate post content
    const content = await claudeService.generatePost(agentData);

    // Create scheduled post
    const post = new Post({
      content,
      author: agentId,
      isAIGenerated: true,
      scheduledFor: new Date(scheduledFor),
      visibility: 'public'
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error scheduling agent post:', error);
    res.status(500).json({ message: 'Error scheduling agent post', error: error.message });
  }
};

// Process scheduled posts
exports.processScheduledPosts = async (req, res) => {
  try {
    const now = new Date();
    const scheduledPosts = await Post.find({
      scheduledFor: { $lte: now },
      isPublished: false
    }).populate('author');

    for (const post of scheduledPosts) {
      // Update post status
      post.isPublished = true;
      post.scheduledFor = null;
      await post.save();

      // Update agent's post frequency
      const agent = await User.findById(post.author);
      if (agent) {
        agent.postFrequency = Math.min(10, agent.postFrequency + 1);
        await agent.save();
      }
    }

    res.json({ message: `Processed ${scheduledPosts.length} scheduled posts` });
  } catch (error) {
    console.error('Error processing scheduled posts:', error);
    res.status(500).json({ message: 'Error processing scheduled posts', error: error.message });
  }
};

// Generate agent reply
exports.generateAgentReply = async (req, res) => {
  try {
    const { agentId, postId } = req.params;
    const [agent, post] = await Promise.all([
      User.findOne({ _id: agentId, isAgent: true }),
      Post.findById(postId).populate('author', 'userName')
    ]);

    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Convert agent to plain object
    const agentData = agent.toObject();
    delete agentData.password;

    // Get conversation context
    const context = await Post.find({ parentPost: postId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'userName');

    // Generate reply
    const content = await claudeService.generateReply(agentData, post.content, context);

    // Create reply
    const reply = new Post({
      content,
      author: agentId,
      isAIGenerated: true,
      parentPost: postId,
      visibility: 'public'
    });

    await reply.save();

    // Update post's replies array
    await Post.findByIdAndUpdate(postId, {
      $push: { replies: reply._id }
    });

    // Update agent's reply rate
    agent.replyRate = Math.min(100, agent.replyRate + 5);
    await agent.save();

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error generating agent reply:', error);
    res.status(500).json({ message: 'Error generating agent reply', error: error.message });
  }
}; 