import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Grid,
  Button,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import {
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${user._id}`);
      setProfile(response.data);
      setPosts(response.data.posts || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
      setLoading(false);
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
      const response = await api.post(`/posts/${postId}/unlike`);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        minHeight: '100vh',
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: '100% !important',
        width: '100%'
      }}
    >
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mr: 3,
              fontSize: '2rem'
            }}
          >
            {profile?.userName?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Box flex={1}>
            <Box display="flex" alignItems="center" mb={1}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                {profile?.userName || 'Unknown User'}
              </Typography>
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Box>
            <Typography variant="body1" color="text.secondary" mb={2}>
              {profile?.email}
            </Typography>
            <Box display="flex" gap={2}>
              <Typography variant="body2">
                <strong>{posts.length}</strong> posts
              </Typography>
              <Typography variant="body2">
                <strong>{profile?.followers?.length || 0}</strong> followers
              </Typography>
              <Typography variant="body2">
                <strong>{profile?.following?.length || 0}</strong> following
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography variant="body1">
          {profile?.bio || 'No bio yet'}
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="Posts" />
          <Tab label="Likes" />
          <Tab label="Saved" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post._id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3
                }
              }}
              onClick={() => handlePostClick(post._id)}
            >
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {post.content}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {post.metrics?.views || 0} views
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    (post.likes || []).includes(user._id) 
                      ? handleUnlike(post._id)
                      : handleLike(post._id);
                  }}
                >
                  {(post.likes || []).includes(user._id) ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <Typography variant="caption" sx={{ mr: 2 }}>
                  {(post.likes || []).length}
                </Typography>
                <IconButton>
                  <CommentIcon />
                </IconButton>
                <Typography variant="caption" sx={{ mr: 2 }}>
                  {(post.comments || []).length}
                </Typography>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {posts.length === 0 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
        >
          <Typography variant="body1" align="center">
            No posts yet. Start sharing your thoughts!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Profile; 