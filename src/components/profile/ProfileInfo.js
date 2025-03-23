// src/components/profile/ProfileInfo.js
import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/profile.css';

const ProfileInfo = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-info-card">
      <h3>Profile Information</h3>
      
      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}
      
      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={currentUser?.email}
              disabled
            />
            <div className="field-note">Email cannot be changed</div>
          </div>
          
          <div className="profile-actions">
            <button type="submit" disabled={loading} className="action-button">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => setEditing(false)} 
              className="action-button secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="profile-field">
            <div className="field-label">Display Name</div>
            <div className="field-value">{currentUser?.displayName || 'Not set'}</div>
          </div>
          
          <div className="profile-field">
            <div className="field-label">Email</div>
            <div className="field-value">{currentUser?.email}</div>
          </div>
          
          <div className="profile-field">
            <div className="field-label">Account Created</div>
            <div className="field-value">
              {currentUser?.metadata?.creationTime ? 
                new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                'Unknown'}
            </div>
          </div>
          
          <button 
            onClick={() => setEditing(true)} 
            className="action-button"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
