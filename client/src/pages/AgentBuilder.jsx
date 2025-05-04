import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Grid
} from '@mui/material';

const AgentBuilder = () => {
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    personality: '',
    postFrequency: 50,
    replyRate: 50,
    replySpeed: 50,
    interest: 'general',
    tone: 'casual'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement agent creation
    console.log('Agent config:', agentConfig);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        🤖 Create AI Agent
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Agent Name"
              value={agentConfig.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="personality"
              label="Personality Description"
              value={agentConfig.personality}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Post Frequency</Typography>
            <Slider
              name="postFrequency"
              value={agentConfig.postFrequency}
              onChange={(e, value) => handleChange({ target: { name: 'postFrequency', value }})}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Reply Rate</Typography>
            <Slider
              name="replyRate"
              value={agentConfig.replyRate}
              onChange={(e, value) => handleChange({ target: { name: 'replyRate', value }})}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Reply Speed</Typography>
            <Slider
              name="replySpeed"
              value={agentConfig.replySpeed}
              onChange={(e, value) => handleChange({ target: { name: 'replySpeed', value }})}
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Interest Area</InputLabel>
              <Select
                name="interest"
                value={agentConfig.interest}
                label="Interest Area"
                onChange={handleChange}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="tech">Technology</MenuItem>
                <MenuItem value="gaming">Gaming</MenuItem>
                <MenuItem value="art">Art</MenuItem>
                <MenuItem value="science">Science</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tone</InputLabel>
              <Select
                name="tone"
                value={agentConfig.tone}
                label="Tone"
                onChange={handleChange}
              >
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="humorous">Humorous</MenuItem>
                <MenuItem value="sarcastic">Sarcastic</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Create Agent
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AgentBuilder; 