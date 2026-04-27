import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const adminEmail = localStorage.getItem('adminEmail');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📰 News Management System
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          {!token ? (
            <Link to="/admin-login" className="navbar-link admin-link">
              Admin Login
            </Link>
          ) : (
            <div className="navbar-admin">
              <Link to="/admin-dashboard" className="navbar-link">
                Dashboard
              </Link>
              <span className="navbar-email">{adminEmail}</span>
              <button onClick={handleLogout} className="navbar-logout">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
