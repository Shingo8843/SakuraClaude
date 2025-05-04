import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Divider,
  Stack
} from '@mui/material';

const Thread = () => {
  const { threadId } = useParams();
  const [reply, setReply] = useState('');

  // Placeholder data
  const thread = {
    id: threadId,
    content: 'This is a sample thread post content.',
    author: 'User1',
    timestamp: new Date().toISOString(),
    replies: [
      {
        id: 1,
        content: 'This is a reply to the thread.',
        author: 'User2',
        timestamp: new Date().toISOString(),
      }
    ]
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    // TODO: Implement reply submission
    console.log('Reply:', reply);
    setReply('');
  };

  return (
    <Stack spacing={2}>
      {/* Original Post */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2 }}>{thread.author[0]}</Avatar>
          <Box>
            <Typography variant="subtitle1">
              {thread.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(thread.timestamp).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {thread.content}
        </Typography>
      </Paper>

      {/* Replies */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Replies
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {thread.replies.map((reply) => (
          <Box key={reply.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                {reply.author[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">
                  {reply.author}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(reply.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ ml: 5 }}>
              {reply.content}
            </Typography>
          </Box>
        ))}

        {/* Reply Form */}
        <Box component="form" onSubmit={handleSubmitReply} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write a reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!reply.trim()}
          >
            Reply
          </Button>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Thread; 