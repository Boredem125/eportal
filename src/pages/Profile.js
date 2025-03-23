// src/pages/Profile.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileInfo from '../components/profile/ProfileInfo';
import QuizHistory from '../components/profile/QuizHistory';
import CourseProgress from '../components/profile/CourseProgress';
import '../styles/profile.css';

const Profile = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account and track your progress</p>
      </div>
      
      <div className="profile-content">
        <ProfileInfo />
        
        <div className="profile-progress-section">
          <CourseProgress />
          <QuizHistory />
        </div>
      </div>
    </div>
  );
};

export default Profile;
