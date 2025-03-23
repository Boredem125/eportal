// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Quizzes from './pages/Quizzes';
import TakeQuiz from './pages/TakeQuiz';
import Profile from './pages/Profile';
import './styles/App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:topicId" element={<CourseDetail />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quizzes/take" element={<TakeQuiz />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
