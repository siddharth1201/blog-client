import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const validateUsername = (username) => /^[a-zA-Z\s]+$/.test(username);
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) => 
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password) &&
  !/(.)\1/.test(password);

function Signup() {
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors on input change
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must contain only letters and spaces.';
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must contain "@" and "."';
      valid = false;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include one uppercase letter, one number, one special character, and no two consecutive characters should be the same.';
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
      const resultAction = await dispatch(signupUser(formData));
      if (signupUser.fulfilled.match(resultAction)) {
        navigate('/login');
      } else {
        console.error('Registration failed:', resultAction.payload);
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>
        
        <div>
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{ borderColor: errors.confirmPassword ? 'red' : 'initial' }}
          />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
        </div>

        <button type="submit">Signup</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default Signup;
