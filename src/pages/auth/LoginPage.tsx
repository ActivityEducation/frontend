// src/pages/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Input, Button, Icon, Card } from '@activityeducation/component-library'; // Assuming Card is also from your library
import { loginUser } from '../../redux/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { theme } from '@activityeducation/component-library'; // Import theme

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Adjust based on toolbar height if fixed */
  background-color: ${theme.colors.background.default};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.default};
  margin: auto;
  width: 100%;
  max-width: 300px;
  background-color: ${theme.colors.background.surface}; /* Changed from .panel to .surface */
  box-shadow: ${theme.shadows.md};
`;

const FormTitle = styled.h3`
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text.default};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error['40']}; /* Using status.error from theme */
  text-align: center;
  font-size: ${theme.typography.body.fontSize};
`;

const StyledLink = styled(Link)`
  color: ${theme.colors.primary['40']};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  return (
    <LoginPageContainer>
        <LoginForm onSubmit={handleSubmit}>
          <FormTitle>Login</FormTitle>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input
            type="text"
            placeholder="Username"
            label="Username"
            leading={<Icon name="fa-solid fa-user" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            css={css`
              padding: ${theme.spacing.sm};
              border: 1px solid ${theme.colors.border.default};
              border-radius: ${theme.borderRadius.sm};
              background-color: ${theme.colors.background.default};
              color: ${theme.colors.text.default};
              &:focus {
                border-color: ${theme.colors.primary['40']};
                outline: none;
              }
            `}
          />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            value={password}
            leading={<Icon name="fa-solid fa-lock" />}
            onChange={(e) => setPassword(e.target.value)}
            required
            css={css`
              width: 100%;
              padding: ${theme.spacing.sm};
              border: 1px solid ${theme.colors.border.default};
              border-radius: ${theme.borderRadius.sm};
              background-color: ${theme.colors.background.default};
              color: ${theme.colors.text.default};
              &:focus {
                border-color: ${theme.colors.primary['40']};
                outline: none;
              }
            `}
          />
          <Button
            type="submit"
            disabled={loading}
            css={css`
              background-color: ${theme.colors.primary['50']};
              color: ${theme.colors.text.onPrimary};
              padding: ${theme.spacing.sm} ${theme.spacing.md};
              border-radius: ${theme.borderRadius.md};
              &:hover {
                background-color: ${theme.colors.primary['60']};
              }
              &:disabled {
                background-color: ${theme.colors.neutral['50']};
                cursor: not-allowed;
              }
            `}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <p style={{ textAlign: 'center', fontSize: theme.typography.body.fontSize, color: theme.colors.text.default }}>
            Don't have an account? <StyledLink to="/register">Register here</StyledLink>
          </p>
        </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;
