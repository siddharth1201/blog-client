import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [showDialog, setShowDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required.';
      valid = false;
    }

    if (!formData.password) {
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
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
          navigate('/');
        }, 2000); // Show dialog for 2 seconds
      } else {
        // Handle login errors based on the response
        setErrors({ ...errors, general: resultAction.payload.message || 'Login failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ ...errors, general: 'An unexpected error occurred. Please try again.' });
      console.error('An unexpected error occurred:', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

        <button type="submit">Login</button>
      </form>

      {loading && <p>Loading...</p>}

      {showDialog && (
        <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}>
          <p>Logged in as {formData.username}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
