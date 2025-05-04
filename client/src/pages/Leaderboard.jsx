import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const Leaderboard = () => {
  const [tab, setTab] = useState(0);

  // Placeholder data
  const dummyData = [
    { rank: 1, username: 'User1', score: 1000, accuracy: '85%', streak: 7 },
    { rank: 2, username: 'User2', score: 850, accuracy: '80%', streak: 5 },
    { rank: 3, username: 'User3', score: 700, accuracy: '75%', streak: 3 },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        🏆 Leaderboard
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Global" />
        <Tab label="Accuracy" />
        <Tab label="Streak" />
      </Tabs>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Accuracy</TableCell>
              <TableCell align="right">Streak</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row) => (
              <TableRow key={row.rank}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell align="right">{row.score}</TableCell>
                <TableCell align="right">{row.accuracy}</TableCell>
                <TableCell align="right">{row.streak}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Leaderboard; 