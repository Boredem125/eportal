// src/pages/Quizzes.js
import React from 'react';
import QuizGenerator from '../components/quizzes/QuizGenerator';
import '../styles/quizzes.css';

const Quizzes = () => {
  return (
    <div className="quizzes-page">
      <div className="quizzes-header">
        <h1>AI-Powered Quizzes</h1>
        <p>Test your knowledge with dynamically generated quizzes on various topics.</p>
      </div>
      
      <div className="quizzes-content">
        <QuizGenerator />
        
        <div className="quiz-info">
          <h3>About Our AI-Powered Quizzes</h3>
          <p>
            Our quizzes are dynamically generated using OpenAI's powerful language models.
            Each quiz is unique and tailored to your selected topic and difficulty level.
          </p>
          <h4>How It Works</h4>
          <ol>
            <li>Select a topic that interests you</li>
            <li>Choose your preferred difficulty level</li>
            <li>Set the number of questions (1-10)</li>
            <li>Click "Generate Quiz" to start</li>
            <li>Answer the questions one by one</li>
            <li>View your final score and review your answers</li>
          </ol>
          <p>Ready to challenge yourself? Generate a quiz now!</p>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
