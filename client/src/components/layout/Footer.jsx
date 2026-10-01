import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/routes.js';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: '1.125rem', color: 'var(--text-primary)' }}>QueueLess</strong>
          <p style={{ marginTop: '0.25rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            AI Enhanced Digital Queue and Smart Token Management System
          </p>
        </div>

        <nav aria-label="Footer Navigation">
          <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
            <li>
              <Link to={APP_ROUTES.PUBLIC.HOME} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Home
              </Link>
            </li>
            <li>
              <Link to={APP_ROUTES.PUBLIC.LOGIN} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Login
              </Link>
            </li>
            <li>
              <Link to={APP_ROUTES.PUBLIC.REGISTER} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Register
              </Link>
            </li>
            <li>
              <a href="#privacy" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Privacy
              </a>
            </li>
            <li>
              <a href="#contact" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          &copy; {new Date().getFullYear()} QueueLess &bull; MERN Architecture Demonstration
        </p>
      </div>
    </footer>
  );
};

export default Footer;
