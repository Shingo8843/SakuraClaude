const Post = require('../models/Post');
const User = require('../models/User');
const claudeService = require('../services/claudeService');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, visibility, tags, scheduledFor } = req.body;
    const userId = req.user.id;

    const post = new Post({
      content,
      author: userId,
      visibility,
      tags,
      scheduledFor,
      isAIGenerated: false
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Generate AI post
exports.generateAIPost = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const agent = await User.findOne({ _id: agentId, isAgent: true });

    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }

    const generatedContent = await claudeService.generatePost(agent);
    
    const post = new Post({
      content: generatedContent,
      author: agentId,
      isAIGenerated: true,
      visibility: 'public'
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error generating AI post:', error);
    res.status(500).json({ message: 'Error generating AI post', error: error.message });
  }
};

// Generate AI reply
exports.generateAIReply = async (req, res) => {
  try {
    const { agentId, parentPostId } = req.params;
    
    const [agent, parentPost] = await Promise.all([
      User.findOne({ _id: agentId, isAgent: true }),
      Post.findById(parentPostId)
    ]);

    if (!agent) {
      return res.status(404).json({ message: 'AI agent not found' });
    }
    if (!parentPost) {
      return res.status(404).json({ message: 'Parent post not found' });
    }

    const generatedReply = await claudeService.generateReply(agent, parentPost.content);
    
    const reply = new Post({
      content: generatedReply,
      author: agentId,
      isAIGenerated: true,
      parentPost: parentPostId,
      visibility: 'public'
    });

    await reply.save();
    
    // Update parent post's replies array
    await Post.findByIdAndUpdate(parentPostId, {
      $push: { replies: reply._id }
    });

    res.status(201).json(reply);
  } catch (error) {
    console.error('Error generating AI reply:', error);
    res.status(500).json({ message: 'Error generating AI reply', error: error.message });
  }
};

// Get posts with pagination
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { parentPost: null }; // Only get main posts, not replies
    if (req.query.author) query.author = req.query.author;
    if (req.query.isAIGenerated !== undefined) query.isAIGenerated = req.query.isAIGenerated;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'userName icon')
        .populate({
          path: 'replies',
          populate: {
            path: 'author',
            select: 'userName icon'
          }
        }),
      Post.countDocuments(query)
    ]);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ message: 'Error getting posts', error: error.message });
  }
};

// Get single post with replies
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'userName icon')
      .populate('comments.author', 'userName icon isAgent')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'userName icon'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.metrics.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ message: 'Error getting post', error: error.message });
  }
};

// Like/unlike post
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
      post.metrics.engagement += 1;
    } else {
      post.likes.splice(likeIndex, 1);
      post.metrics.engagement = Math.max(0, post.metrics.engagement - 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is authorized to delete
    if (post.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all replies
    await Post.deleteMany({ parentPost: post._id });
    
    // Delete the post
    await post.remove();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    console.log('Adding comment to post:', req.params.id);
    console.log('Comment data:', req.body);
    
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      console.log('Post not found:', req.params.id);
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      author: req.user.id,
      content,
      isAgentGenerated: req.user.isAgent
    };

    console.log('New comment:', comment);

    // Use $push operator to ensure the comments array exists
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { 
        new: true,
        runValidators: true
      }
    ).populate('comments.author', 'userName icon isAgent');

    if (!updatedPost) {
      console.log('Post not found after update:', req.params.id);
      return res.status(404).json({ message: 'Post not found after update' });
    }

    console.log('Updated post:', updatedPost);

    // Return the last comment
    const lastComment = updatedPost.comments[updatedPost.comments.length - 1];
    res.json(lastComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or post author
    if (comment.author.toString() !== req.user.id && post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
}; 