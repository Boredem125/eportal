// src/components/courses/CourseList.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/courses.css';

const subjects = [
  {
    id: 'programming',
    name: 'Programming',
    topics: [
      { id: 'javascript', name: 'JavaScript' },
      { id: 'python', name: 'Python' },
      { id: 'java', name: 'Java' },
      { id: 'react', name: 'React' }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    topics: [
      { id: 'calculus', name: 'Calculus' },
      { id: 'algebra', name: 'Algebra' },
      { id: 'statistics', name: 'Statistics' },
      { id: 'discrete-math', name: 'Discrete Mathematics' }
    ]
  },
  {
    id: 'physics',
    name: 'Physics',
    topics: [
      { id: 'mechanics', name: 'Mechanics' },
      { id: 'electromagnetism', name: 'Electromagnetism' },
      { id: 'thermodynamics', name: 'Thermodynamics' },
      { id: 'quantum-physics', name: 'Quantum Physics' }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    topics: [
      { id: 'electrical-engineering', name: 'Electrical Engineering' },
      { id: 'mechanical-engineering', name: 'Mechanical Engineering' },
      { id: 'civil-engineering', name: 'Civil Engineering' },
      { id: 'chemical-engineering', name: 'Chemical Engineering' }
    ]
  }
];

const CourseList = () => {
  return (
    <div className="course-list">
      <h2>Available Courses</h2>
      <div className="subjects-container">
        {subjects.map((subject) => (
          <div key={subject.id} className="subject-section">
            <h3>{subject.name}</h3>
            <div className="topics-grid">
              {subject.topics.map((topic) => (
                <Link 
                  key={topic.id} 
                  to={`/courses/${topic.id}`} 
                  className="topic-card"
                >
                  <h4>{topic.name}</h4>
                  <span className="view-lessons">View Lessons</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
