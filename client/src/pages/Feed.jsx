import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      // Handle the response format from the backend
      setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setPosts([]); // Set empty array on error
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await api.post('/posts', {
        content: newPost,
        visibility: 'public'
      });
      // Add the new post to the beginning of the array
      setPosts(prevPosts => [response.data, ...(Array.isArray(prevPosts) ? prevPosts : [])]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );
    } catch (err) {
      console.error('Error unliking post:', err);
      setError('Failed to unlike post');
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  // Add a function to refresh posts
  const refreshPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
    } catch (err) {
      console.error('Error refreshing posts:', err);
      setError('Failed to refresh posts');
    }
  };

  // Listen for post updates
  useEffect(() => {
    const handlePostUpdate = async (event) => {
      const { postId, comments } = event.detail;
      if (postId) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, comments: comments || post.comments }
              : post
          )
        );
      } else {
        // If no postId is provided, refresh all posts
        await refreshPosts();
      }
    };

    window.addEventListener('postUpdated', handlePostUpdate);
    return () => {
      window.removeEventListener('postUpdated', handlePostUpdate);
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handlePostSubmit}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!newPost.trim()}
            >
              Post
            </Button>
          </form>
        </Paper>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post._id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handlePostClick(post._id)}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2 }}>
                  {post.author?.userName?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {post.author?.userName || 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  {post.metrics?.views || 0} views
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • {post.metrics?.shares || 0} shares
                </Typography>
              </Box>
            </CardContent>
            <Divider />
            <CardActions>
              <IconButton
                onClick={() => (post.likes || []).includes(user._id) 
                  ? handleUnlike(post._id)
                  : handleLike(post._id)
                }
              >
                {(post.likes || []).includes(user._id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="caption">
                {(post.likes || []).length}
              </Typography>
              <IconButton>
                <CommentIcon />
              </IconButton>
              <Typography variant="caption">
                {(post.comments || []).length}
              </Typography>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No posts yet. Be the first to post!
        </Typography>
      )}
    </Container>
  );
};

export default Feed; 