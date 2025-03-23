// src/components/profile/CourseProgress.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../../styles/profile.css';

const CourseProgress = () => {
  const { currentUser } = useAuth();
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().completedVideos) {
            setCompletedVideos(userDoc.data().completedVideos);
          }
        } catch (error) {
          console.error('Error fetching course progress:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProgress();
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Loading course progress...</div>;
  }

  if (completedVideos.length === 0) {
    return (
      <div className="course-progress-card">
        <h3>Course Progress</h3>
        <div className="empty-state">
          <p>You haven't completed any course videos yet.</p>
          <p>Start watching courses to track your progress!</p>
          <Link to="/courses" className="action-button">Browse Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-progress-card">
      <h3>Course Progress</h3>
      
      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-value">{completedVideos.length}</div>
          <div className="stat-label">Videos Completed</div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h4>Recently Completed</h4>
        <div className="activity-list">
          {completedVideos.slice(0, 5).map((videoId, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">✓</div>
              <div className="activity-text">
                Completed a video
                <span className="activity-timestamp">Video ID: {videoId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
