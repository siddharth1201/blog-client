import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthenticatedRoute = ({ redirectPath = '/home' }) => {
  const { user } = useSelector((state) => state.auth);

  // Redirect authenticated users away from login and signup pages
  return user ? <Navigate to={redirectPath} /> : <Outlet />;
};

export default AuthenticatedRoute;
