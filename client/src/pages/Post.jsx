import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
      setComments(response.data.comments || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/posts/${id}/comments`, {
        content: newComment
      });
      const updatedComments = [...comments, response.data];
      setComments(updatedComments);
      setNewComment('');
      // Dispatch event with post details
      window.dispatchEvent(new CustomEvent('postUpdated', {
        detail: {
          postId: id,
          comments: updatedComments
        }
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${id}/like`);
      setPost(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
      setError('Failed to like post');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" color="error" align="center">
          Post not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Feed
        </Button>

        <Card>
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
            <IconButton onClick={handleLike}>
              {post.likes?.includes(user._id) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="caption">
              {post.likes?.length || 0}
            </Typography>
            <IconButton>
              <CommentIcon />
            </IconButton>
            <Typography variant="caption">
              {comments.length}
            </Typography>
            <IconButton>
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!newComment.trim()}
            >
              Comment
            </Button>
          </form>
        </Paper>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      <List>
        {comments.map((comment) => (
          <ListItem
            key={comment._id}
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <ListItemAvatar>
              <Avatar>
                {comment.author?.userName?.[0]?.toUpperCase() || '?'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle2">
                    {comment.author?.userName || 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              }
              secondary={comment.content}
            />
          </ListItem>
        ))}
      </List>

      {comments.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}
    </Container>
  );
};

export default Post; 