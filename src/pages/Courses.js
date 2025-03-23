// src/pages/Courses.js
import React, { useState } from 'react';
import CourseList from '../components/courses/CourseList';
import '../styles/courses.css';

const Courses = () => {
  const [coursesError, setCoursesError] = useState(null);

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Courses</h1>
        <p>Explore our wide range of educational courses and enhance your knowledge.</p>
      </div>
      {coursesError && <div className="error-message">{coursesError}</div>}
      <CourseList onError={setCoursesError} />
    </div>
  );
};

export default Courses;
