import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/Button.jsx';
import { APP_ROUTES } from '../../constants/routes.js';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.PUBLIC.HOME);
  };

  const isPublicPage = location.pathname === APP_ROUTES.PUBLIC.HOME ||
    location.pathname === APP_ROUTES.PUBLIC.LOGIN ||
    location.pathname === APP_ROUTES.PUBLIC.REGISTER ||
    location.pathname === APP_ROUTES.PUBLIC.UNAUTHORIZED;

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to={APP_ROUTES.PUBLIC.HOME} className="brand-logo">
          <span>⚡</span>
          <span>QueueLess</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {isPublicPage && !isAuthenticated ? (
              <>
                <li>
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="nav-link">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="nav-link">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="nav-link">
                    About
                  </a>
                </li>
              </>
            ) : null}

            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <li>
                    <NavLink to={APP_ROUTES.ADMIN.DASHBOARD} className="nav-link">
                      Admin Console
                    </NavLink>
                  </li>
                ) : (
                  <>
                    <li>
                      <NavLink to={APP_ROUTES.CUSTOMER.DASHBOARD} className="nav-link">
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={APP_ROUTES.CUSTOMER.SERVICES} className="nav-link">
                        Services
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={APP_ROUTES.CUSTOMER.TOKENS} className="nav-link">
                        My Tokens
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={APP_ROUTES.CUSTOMER.APPOINTMENTS} className="nav-link">
                        Appointments
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={APP_ROUTES.CUSTOMER.QUEUE} className="nav-link">
                        Live Queue
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={APP_ROUTES.CUSTOMER.PROFILE} className="nav-link">
                        Profile
                      </NavLink>
                    </li>
                  </>
                )}

                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="user-pill">
                    <span style={{ fontSize: '0.875rem' }}>👤</span>
                    <span className="user-name">{user?.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link to={APP_ROUTES.PUBLIC.LOGIN} className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to={APP_ROUTES.PUBLIC.REGISTER} className="btn btn-primary btn-sm">
                  Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
