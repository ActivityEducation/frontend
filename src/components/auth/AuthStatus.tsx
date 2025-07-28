// src/components/auth/AuthStatus.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router'; // Changed from 'react-router-dom'
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@activityeducation/component-library';
import { logout } from '../../redux/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { theme } from '@activityeducation/component-library';

const AuthStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  maring-left: auto;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StyledWelcomeText = styled.span`
  color: ${theme.colors.text.default};
  font-size: ${theme.typography.bodySmall.fontSize};
  margin-right: ${theme.spacing.sm};
`;

const AuthStatus = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AuthStatusContainer>
      {isAuthenticated ? (
        <>
          <StyledWelcomeText>
            Welcome, {user?.username || 'User'}!
          </StyledWelcomeText>
          <Button variant='ghost' onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant='ghost' size='sm' onClick={() => navigate('/register')}>
            Register
          </Button>
          <Button size='sm' onClick={() => navigate('/login')}>
            Login
          </Button>
        </>
      )}
    </AuthStatusContainer>
  );
};

export default AuthStatus;
