// src/pages/CourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchVideos } from '../services/youtubeApi';
import VideoPlayer from '../components/courses/VideoPlayer';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/courses.css';

const CourseDetail = () => {
  const { topicId } = useParams();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [completedVideos, setCompletedVideos] = useState([]);
  const [name, setName] = useState();

  useEffect(() => {
    let isMounted = true;

    const fetchVideosAndProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // Format search query
        const formattedTopic = `${topicId.replace(/-/g, ' ')} tutorial`;
        const results = await searchVideos(formattedTopic, 10);



        if (!results?.length) {
          throw new Error('No tutorials found for this course');
        }

        setVideos(results);
        setSelectedVideo(results[0]);

        // Fetch user progress if logged in
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setCompletedVideos(userDoc.data().completedVideos || []);
            setName(userDoc.data().name)

          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message.includes('quota')
            ? 'Daily video limit reached. Try again tomorrow.'
            : err.message
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const demoTest = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', 'ET6uTsqx9JQRbevGPHuoaIrDq8S2'));
        if (userDoc.exists()) {
          console.log(userDoc.data());
          console.log(currentUser.uid)
        }
      } catch (err) {
        console.log(err.message);
      }
    }
    //demoTest();
    fetchVideosAndProgress();
    return () => { isMounted = false };
  }, [topicId, currentUser]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVideoComplete = async (videoId) => {


    try {
      if (!currentUser) return;

      // Update local state optimistically
      setCompletedVideos(prev => [...prev, videoId]);

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        completedVideos: arrayUnion(videoId)
      });

    } catch (err) {
      console.error('Failed to update progress:', err);
      // Rollback local state on error
      setCompletedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const formatTopicName = (id) => {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="course-detail-header">
        <h1>{formatTopicName(topicId)} Tutorials {name}</h1>
        {currentUser && (
          <div className="progress-indicator">
            Completed: {completedVideos.length}/{videos.length}
          </div>
        )}
      </div>

      <div className="course-content">
        {selectedVideo && (
          <>
            <VideoPlayer
              video={selectedVideo}
              onComplete={handleVideoComplete}
              completed={completedVideos.includes(selectedVideo.id.videoId)}
            />
            
          </>
        )}

        <div className="video-list-container">
          <h3>Available Lessons</h3>
          <div className="video-grid">
            {videos.map((video) => (
              <div
                key={video.id.videoId}
                className={`video-card ${selectedVideo?.id.videoId === video.id.videoId ? 'active' : ''
                  } ${completedVideos.includes(video.id.videoId) ? 'completed' : ''
                  }`}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="thumbnail-wrapper">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                  {completedVideos.includes(video.id.videoId) && (
                    <div className="completion-badge">
                      <span>✓</span>
                    </div>
                  )}
                </div>
                <div className="video-info">
                  <h4 className="video-title">{video.snippet.title}</h4>
                  <p className="video-channel">{video.snippet.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
