import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ redirectPath = '/' }) => {
  const { user } = useSelector((state) => state.auth);

  // If the user is authenticated, redirect to the specified path (default: home page)
  return !user ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default PublicRoute;
