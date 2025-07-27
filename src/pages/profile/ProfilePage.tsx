// src/pages/profile/ProfilePage.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { RootState } from '../../redux/store';
import { theme } from '@activityeducation/component-library';

const ProfilePageContainer = styled.div`
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

const ProfileTitle = styled.h2`
  font-size: ${theme.typography.h2.fontSize};
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.primary['50']};
  margin-bottom: ${theme.spacing.md};
`;

const ProfileDetail = styled.p`
  font-size: ${theme.typography.body.fontSize}; /* Corrected: direct md fontSize */
  color: ${theme.colors.text.default};
  margin-bottom: ${theme.spacing.sm};
`;

const InfoText = styled.p` /* Defined InfoText here to resolve error */
  font-size: ${theme.typography.body.fontSize};
  color: ${theme.colors.text.default};
  margin-bottom: ${theme.spacing.lg};
`;

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <ProfilePageContainer>
        <ProfileTitle>No user data available.</ProfileTitle>
        <InfoText>Please log in to view your profile.</InfoText> {/* InfoText used here */}
      </ProfilePageContainer>
    );
  }

  return (
    <ProfilePageContainer>
      <ProfileTitle>User Profile</ProfileTitle>
      <ProfileDetail>
        <strong>Username:</strong> {user.username}
      </ProfileDetail>
      <ProfileDetail>
        <strong>Email:</strong> {user.email || 'N/A'}
      </ProfileDetail>
      {/* Add more profile details as needed */}
    </ProfilePageContainer>
  );
};

export default ProfilePage;
