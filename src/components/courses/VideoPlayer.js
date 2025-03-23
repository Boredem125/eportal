// src/components/courses/VideoPlayer.js
import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/courses.css';

const VideoPlayer = ({ video, onComplete }) => {
  const [completed, setCompleted] = useState(false);
  const { currentUser } = useAuth();

  const handleVideoEnd = async () => {
    if (!completed && currentUser) {
      try {
        // Update user's completed videos in Firestore
        await updateDoc(doc(db, 'users', currentUser.uid), {
          completedVideos: arrayUnion(video.id.videoId)
        });
        
        setCompleted(true);
        
        if (onComplete) {
          onComplete(video.id.videoId);
        }
      } catch (error) {
        console.error('Error updating completed videos:', error);
      }
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-responsive">
        <iframe
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${video.id.videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.snippet.title}
          onEnded={handleVideoEnd}
        ></iframe>
      </div>
      <div className="video-info">
        <h2>{video.snippet.title}</h2>
        <div className="video-description">
          {video.snippet.description}
        </div>
        {completed && (
          <div className="completion-badge">
            ✅ Marked as completed
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
