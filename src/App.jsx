// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import ViewPost from './components/ViewPost'; // Import the ViewPost component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/view/:slug" element={<ViewPost />} /> {/* Route for viewing posts */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
