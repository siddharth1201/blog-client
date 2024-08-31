// Register.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './css/loginSignup.css'; // Import the CSS file

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const formRef = useRef(null);
  const messageRef = useRef(null);
  const spinnerRef = useRef(null); // Reference for spinner animation

  useEffect(() => {
    // Animation for form entrance
    gsap.from(formRef.current, { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!/^[a-zA-Z\s]+$/.test(formData.username)) {
      newErrors.username = 'Username must contain only letters and spaces.';
      valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email must contain "@" and "."';
      valid = false;
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters, include one uppercase letter, one number, one special character, and no two consecutive characters should be the same.';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please retype.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(signupUser(formData));
      // Navigate to login page after a successful registration
      setSuccessMessage('Registered successfully, login now');
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      // Navigate to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" ref={formRef}>
        <h2 className="login-title">Sign Up</h2>
        {successMessage && (
          <p className="success-message" ref={messageRef}>
            {successMessage}
          </p>
        )}
        {loading && (
          <div className="loading-spinner" ref={spinnerRef}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="input-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="input-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="input-field">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
