import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import ViewPost from './components/ViewPost';
import NavBar from './components/NavBar';
import PublicRoute from './components/PublicRoutes'; // Import PublicRoute

function App() {
  return (
    <Router>
      <NavBar /> {/* Add the NavBar component */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoute />}>
          <Route path="/create" element={<CreatePost />} />
          <Route path="/view/:slug" element={<ViewPost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
