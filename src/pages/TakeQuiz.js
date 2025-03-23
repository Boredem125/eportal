// src/pages/TakeQuiz.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { generateQuiz } from '../services/OpenaiApi';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import QuizQuestion from '../components/quizzes/QuizQuestion';
import '../styles/quizzes.css';

const TakeQuiz = () => {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty') || 'medium';
  const count = parseInt(searchParams.get('count') || '5');
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const formattedTopic = topic.replace(/_/g, ' ');
        const quizQuestions = await generateQuiz(formattedTopic, difficulty, count);
        setQuestions(quizQuestions);
      } catch (err) {
        console.error('Error generating quiz:', err);
        setError('Failed to generate quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchQuiz();
    } else {
      setError('No topic specified');
      setLoading(false);
    }
  }, [topic, difficulty, count]);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Update answers
    const newAnswers = [...answers, {
      question: currentQuestion.question,
      selectedOption,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }];
    
    setAnswers(newAnswers);
    
    // Update score
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Move to next question or finish quiz
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        completeQuiz(newAnswers, isCorrect ? score + 1 : score);
      }
    }, 1000);
  };

  const completeQuiz = async (finalAnswers, finalScore) => {
    setQuizCompleted(true);
    
    // Save quiz results to Firebase if user is logged in
    if (currentUser) {
      try {
        const quizResult = {
          topic: topic.replace(/_/g, ' '),
          difficulty,
          score: finalScore,
          totalQuestions: questions.length,
          timestamp: new Date().toISOString(),
          answers: finalAnswers
        };
        
        await updateDoc(doc(db, 'users', currentUser.uid), {
          quizResults: arrayUnion(quizResult)
        });
      } catch (error) {
        console.error('Error saving quiz results:', error);
      }
    }
  };

  const formatTopicName = (topicId) => {
    return topicId
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Generating your {difficulty} quiz on {formatTopicName(topic)}...</p>
        <p className="loading-tip">This may take a moment as our AI crafts unique questions for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/quizzes')} className="back-button">
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-results">
        <h2>Quiz Completed!</h2>
        <div className="score-container">
          <div className="score-circle">
            <div className="score-number">{score}</div>
            <div className="score-total">/ {questions.length}</div>
          </div>
          <div className="score-text">
            {score === questions.length ? 'Perfect Score!' : 
              score >= questions.length * 0.7 ? 'Great Job!' : 
                score >= questions.length * 0.5 ? 'Good Effort!' : 'Keep Practicing!'}
          </div>
        </div>
        
        <div className="quiz-summary">
          <h3>Quiz Summary</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span className="summary-label">Topic:</span>
              <span className="summary-value">{formatTopicName(topic)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Difficulty:</span>
              <span className="summary-value">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Score:</span>
              <span className="summary-value">{score} out of {questions.length} ({Math.round(score / questions.length * 100)}%)</span>
            </div>
          </div>
        </div>
        
        <div className="answer-review">
          <h3>Review Your Answers</h3>
          {answers.map((answer, index) => (
            <div key={index} className={`review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="review-question">
                <span className="question-number">Q{index + 1}:</span> {answer.question}
              </div>
              <div className="review-answer">
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
        
        <div className="quiz-actions">
          <button onClick={() => navigate('/quizzes')} className="action-button">
            Take Another Quiz
          </button>
          <button onClick={() => navigate('/')} className="action-button secondary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="take-quiz-container">
      <div className="quiz-header">
        <h2>{formatTopicName(topic)} Quiz</h2>
        <div className="quiz-details">
          <span className="difficulty-badge">{difficulty}</span>
          <span className="question-count">{questions.length} questions</span>
        </div>
      </div>
      
      {questions.length > 0 && currentQuestionIndex < questions.length && (
        <QuizQuestion
          question={questions[currentQuestionIndex].question}
          options={questions[currentQuestionIndex].options}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}
    </div>
  );
};

export default TakeQuiz;
