// src/pages/home/HomePage.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RootState } from '../../redux/store';
import { theme } from '@activityeducation/component-library';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px); /* Adjust based on toolbar height */
  background-color: ${theme.colors.background.default};
  color: ${theme.colors.text.default};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const WelcomeMessage = styled.h2`
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.primary['50']};
  margin-bottom: ${theme.spacing.md};
`;

const InfoText = styled.p`
  font-size: ${theme.typography.body.fontSize};
  color: ${theme.colors.text.default};
  margin-bottom: ${theme.spacing.lg};
`;

const HomePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <HomePageContainer>
      <WelcomeMessage>Welcome, {user?.username || 'Guest'}!</WelcomeMessage>
      <InfoText>This is your personalized home dashboard. More content coming soon!</InfoText>
      {/* You can add more dashboard-specific widgets or content here */}
    </HomePageContainer>
  );
};

export default HomePage;
