// AuthenticatedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthenticatedRoute = ({ redirectPath = '/login' }) => {
  const { user } = useSelector((state) => state.auth);

  // If the user is not authenticated, redirect to the specified path (default: login page)
  return user ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default AuthenticatedRoute;
