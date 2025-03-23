// src/components/quizzes/QuizGenerator.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/quizzes.css';

const topics = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'react', name: 'React' },
  { id: 'html_css', name: 'HTML & CSS' },
  { id: 'data_structures', name: 'Data Structures' },
  { id: 'algorithms', name: 'Algorithms' },
  { id: 'computer_networks', name: 'Computer Networks' },
  { id: 'operating_systems', name: 'Operating Systems' },
  { id: 'database_systems', name: 'Database Systems' },
  { id: 'machine_learning', name: 'Machine Learning' }
];

const QuizGenerator = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTopic) {
      navigate(`/quizzes/take?topic=${selectedTopic}&difficulty=${difficulty}&count=${questionCount}`);
    }
  };

  return (
    <div className="quiz-generator">
      <h2>Generate a Quiz</h2>
      <p>Select a topic and customize your quiz settings</p>
      
      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <select 
            id="topic" 
            value={selectedTopic} 
            onChange={(e) => setSelectedTopic(e.target.value)}
            required
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select 
            id="difficulty" 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="count">Number of Questions</label>
          <input 
            type="number" 
            id="count" 
            min="1" 
            max="10" 
            value={questionCount} 
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          />
        </div>
        
        <button type="submit" className="generate-button">Generate Quiz</button>
      </form>
    </div>
  );
};

export default QuizGenerator;
