// src/components/profile/QuizHistory.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/profile.css';

const QuizHistory = () => {
  const { currentUser } = useAuth();
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizResults = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().quizResults) {
            // Sort by timestamp (most recent first)
            const sortedResults = [...userDoc.data().quizResults]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            setQuizResults(sortedResults);
          }
        } catch (error) {
          console.error('Error fetching quiz results:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizResults();
  }, [currentUser]);

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz === selectedQuiz ? null : quiz);
  };

  if (loading) {
    return <div className="loading">Loading quiz history...</div>;
  }

  if (quizResults.length === 0) {
    return (
      <div className="quiz-history-card">
        <h3>Quiz History</h3>
        <div className="empty-state">
          <p>You haven't taken any quizzes yet.</p>
          <p>Start a quiz to see your history here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-history-card">
      <h3>Quiz History</h3>
      
      <div className="quiz-list">
        {quizResults.map((quiz, index) => (
          <div 
            key={index} 
            className={`quiz-item ${selectedQuiz === quiz ? 'expanded' : ''}`}
            onClick={() => handleQuizSelect(quiz)}
          >
            <div className="quiz-item-header">
              <div className="quiz-summary">
                <div className="quiz-title">{quiz.topic}</div>
                <div className="quiz-subtitle">
                  {quiz.difficulty} • {new Date(quiz.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="quiz-score">
                <div className="score-value">{quiz.score}/{quiz.totalQuestions}</div>
                <div className="score-percent">
                  {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                </div>
              </div>
              <div className="expand-icon">
                {selectedQuiz === quiz ? '▲' : '▼'}
              </div>
            </div>
            
            {selectedQuiz === quiz && (
              <div className="quiz-details">
                <h4>Questions and Answers</h4>
                {quiz.answers.map((answer, idx) => (
                  <div 
                    key={idx} 
                    className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="answer-question">Q{idx + 1}: {answer.question}</div>
                    <div className="answer-details">
                      <div className="your-answer">
                        <span>Your answer:</span> {answer.selectedOption}
                      </div>
                      {!answer.isCorrect && (
                        <div className="correct-answer">
                          <span>Correct answer:</span> {answer.correctAnswer}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizHistory;
