// src/services/authValidation.js
export const validateEmail = (email) => {
    // Check if email ends with @vitstudent.ac.in
    return email.endsWith('@vitstudent.ac.in');
  };
  