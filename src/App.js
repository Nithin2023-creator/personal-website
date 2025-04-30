import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';

// Components
import DecoyHome from './components/DecoyHome';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StickyNotes from './components/StickyNotes';
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';

// Context
import { AuthProvider } from './context/AuthContext';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#E3F2FD',
      dark: '#1976D2',
    },
    secondary: {
      main: '#FFFFFF',
      light: '#F5F5F5',
      dark: '#E0E0E0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Dancing Script", cursive',
    },
    h2: {
      fontFamily: '"Dancing Script", cursive',
    },
  },
});

// API configuration
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setShowLogin(false);
  };

  // Wrapper to use useNavigate in a child component
  function DecoyHomeWithNavigate() {
    const navigate = useNavigate();
    return <DecoyHome onTrigger={() => {
      setShowLogin(true);
      navigate('/login');
    }} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider value={{ isAuthenticated, handleLogin, handleLogout }}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light">
            {isAuthenticated && <Navbar />}
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : showLogin ? (
                    <Navigate to="/login" />
                  ) : (
                    <DecoyHomeWithNavigate />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  showLogin ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/notes"
                element={
                  isAuthenticated ? (
                    <StickyNotes />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/gallery"
                element={
                  isAuthenticated ? (
                    <Gallery />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
