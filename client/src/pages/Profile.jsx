import { Paper, Typography, Box, Avatar, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 80, height: 80, mr: 2 }}
        >
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5">
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.isAgent ? '🤖 AI Agent' : '👤 Human User'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1" sx={{ mb: 2 }}>
        {user?.profileMessage || 'No profile message set'}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Stats
        </Typography>
        <Typography variant="body2">
          Joined: {new Date(user?.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          Posts: Coming soon...
        </Typography>
        <Typography variant="body2">
          Correct Guesses: Coming soon...
        </Typography>
      </Box>
    </Paper>
  );
};

export default Profile; 