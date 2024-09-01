import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { gsap } from 'gsap';
import './css/navbar.css'; // Import the updated CSS for styling

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuContainerRef = useRef(null);
  const menuItemsRef = useRef([]);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user } = useSelector((state) => state.auth); // Access user state from Redux store

  useEffect(() => {
    // Set initial state: hide menu items
    gsap.set(menuItemsRef.current, { x: '-100%', opacity: 0 });

    // Hover animation: reveal menu items
    const handleMouseEnter = () => {
      gsap.to(menuItemsRef.current, {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    // Mouse leave animation: hide menu items
    const handleMouseLeave = () => {
      gsap.to(menuItemsRef.current, {
        x: '-100%',
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.in',
      });
    };

    // Attach events to the container
    const container = menuContainerRef.current;
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Clean up event listeners on unmount
    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleCreatePost = () => {
    navigate('/create');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navbar" ref={menuContainerRef}>
      <div className="menu-button">
        {/* Circle with menu symbol */}
        <span className="menu-icon">&#9776;</span>
      </div>
      <ul className="navbar-list">
        {/* Always visible Home link */}
        <li className="navbar-item" ref={(el) => (menuItemsRef.current[0] = el)}>
          <NavLink
            to="/"
            className="navbar-link"
            activeClassName="active-link"
          >
            Home
          </NavLink>
        </li>

        {/* Conditional links based on authentication state */}
        {!user && (
          <>
            <li className="navbar-item" ref={(el) => (menuItemsRef.current[1] = el)}>
              <NavLink
                to="/login"
                className="navbar-link"
                activeClassName="active-link"
              >
                Login
              </NavLink>
            </li>
            <li className="navbar-item" ref={(el) => (menuItemsRef.current[2] = el)}>
              <NavLink
                to="/signup"
                className="navbar-link"
                activeClassName="active-link"
              >
                Signup
              </NavLink>
            </li>
          </>
        )}

        {user && (
          <>
            <li className="navbar-item" ref={(el) => (menuItemsRef.current[3] = el)}>
              <a className="navbar-link" onClick={handleCreatePost}>
                Create Post
              </a>
            </li>
            <li className="navbar-item" ref={(el) => (menuItemsRef.current[4] = el)}>
              <a className="navbar-link" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </>
        )}
      </ul>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <p>Are you sure you want to logout?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>No</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
