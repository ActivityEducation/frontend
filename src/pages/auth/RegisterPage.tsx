// src/pages/auth/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Input, Button, Icon } from '@activityeducation/component-library'; // Assuming Card is also from your library
import { registerUser } from '../../redux/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { theme } from '@activityeducation/component-library'; // Import theme

const RegisterPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Adjust based on toolbar height if fixed */
  background-color: ${theme.colors.background.default};
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.default};
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

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Assuming register requires email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password })); // Assuming backend expects email for registration
  };

  return (
    <RegisterPageContainer>
        <RegisterForm onSubmit={handleSubmit}>
          <FormTitle>Register</FormTitle>
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
          <Input
            type="email"
            placeholder="Email"
            label="Email"
            leading={<Icon name="fa-regular fa-envelope" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            leading={<Icon name="fa-solid fa-lock" />}
            value={password}
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <p style={{ textAlign: 'center', fontSize: theme.typography.body.fontSize, color: theme.colors.text.default }}>
            Already have an account? <StyledLink to="/login">Login here</StyledLink>
          </p>
        </RegisterForm>
    </RegisterPageContainer>
  );
};

export default RegisterPage;
