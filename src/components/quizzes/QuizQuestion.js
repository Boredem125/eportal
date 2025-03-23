import React, { useState, useEffect } from 'react';
import '../../styles/quizzes.css';

const QuizQuestion = ({ question, options, onAnswer, questionNumber, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  // ✅ Reset state when the question changes
  useEffect(() => {
    setSelectedOption(null);
    setAnswered(false);
  }, [question]);

  const handleOptionSelect = (option) => {
    if (!answered) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !answered) {
      setAnswered(true);
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="quiz-question-container">
      <div className="quiz-progress">
        <div className="question-counter">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-indicator" 
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="question-content">
        <h3>{question}</h3>
        
        <div className="options-list">
          {options.map((option, index) => (
            <div 
              key={index}
              className={`option ${selectedOption === option ? 'selected' : ''} ${
                answered ? 'disabled' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <div className="option-letter">{String.fromCharCode(65 + index)}</div>
              <div className="option-text">{option}</div>
            </div>
          ))}
        </div>
        
        <button 
          className="submit-answer" 
          onClick={handleSubmit}
          disabled={!selectedOption || answered}
        >
          {answered ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
