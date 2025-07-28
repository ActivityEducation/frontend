// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router'; // Changed from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { ThemeProvider, theme, Toolbar } from '@activityeducation/component-library';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { setAuthFromLocalStorage } from './redux/authSlice';
import AuthStatus from './components/auth/AuthStatus';
import PrivateRoute from './components/auth/PrivateRoute';

import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/profile/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import spinner from './fidget-spinner.png';
import logo from './logo.png';
import './App.css';

// Styled component for the EduPub text in the toolbar
const EduPubText = styled.span`
  font-weight: bold;
  color: black;
  display: flex;
  font-size: ${theme.typography.bodyLarge.fontSize}; /* Using h4 fontSize for a bolder look */
`;

const EduPubTextLink = styled(Link)`
  text-decoration: none;
  align-content: center;
`;

const toolbarBackend = css`
  backgroundColor: ${theme.colors.background.surface}; /* Using a distinct primary blue */
  color: ${theme.colors.text.default};
  padding: ${theme.spacing.md};
  boxShadow: ${theme.shadows.md}; /* Added a medium shadow for depth */
`;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to set authentication from local storage on app load
    dispatch(setAuthFromLocalStorage());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Toolbar justifyContent="space-between">
          <div style={{ display: 'flex', alignContent: 'center', color: 'black', gap: '10px' }}>
            <img style={{ maxHeight: '32px', maxWidth: '32px' }} src={logo} alt="EduPub Logo" />
            <EduPubTextLink to="/home">
              <EduPubText>EduPub</EduPubText>
            </EduPubTextLink>
          </div>
          <AuthStatus /> {/* Auth status component for login/register/logout buttons */}
        </Toolbar>

        {/* Define application routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/" element={<Navigate to="/home" replace />} /> {/* Redirect root to home */}

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={
            <header className="App-header">
              <img src={spinner} className="App-logo" alt="logo" />
              <p>
                Please pardon our dust.
              </p>
              <p>Page Not Found</p>
            </header>
          } />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;