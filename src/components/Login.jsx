// Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './css/loginSignup.css'; // CSS file for styles

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const formRef = useRef(null);

  useEffect(() => {
    // Animation for form entrance
    gsap.from(formRef.current, { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
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
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/');
      } else {
        setErrors({ ...errors, general: resultAction.payload.message || 'Login failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ ...errors, general: 'An unexpected error occurred. Please try again.' });
      console.error('An unexpected error occurred:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" ref={formRef}>
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => gsap.to(formRef.current, { scale: 1.05, duration: 0.3 })}
              onBlur={() => gsap.to(formRef.current, { scale: 1, duration: 0.3 })}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => gsap.to(formRef.current, { scale: 1.05, duration: 0.3 })}
              onBlur={() => gsap.to(formRef.current, { scale: 1, duration: 0.3 })}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {errors.general && <p className="error">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
