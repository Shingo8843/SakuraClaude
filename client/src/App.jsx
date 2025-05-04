import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AgentBuilder from './pages/AgentBuilder';
import Thread from './pages/Thread';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff69b4', // Sakura pink
    },
    secondary: {
      main: '#4a90e2', // Blue
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          overflowX: 'hidden'
        },
        '#root': {
          width: '100%',
          margin: 0,
          padding: 0
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/feed" replace />} />
              <Route path="feed" element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } />
              <Route path="posts/:id" element={
                <PrivateRoute>
                  <Post />
                </PrivateRoute>
              } />
              <Route path="profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="leaderboard" element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              } />
              <Route path="agent-builder" element={
                <PrivateRoute>
                  <AgentBuilder />
                </PrivateRoute>
              } />
              <Route path="thread/:threadId" element={
                <PrivateRoute>
                  <Thread />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
