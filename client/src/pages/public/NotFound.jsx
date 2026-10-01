import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/routes.js';

export const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <span style={{ fontSize: '4rem' }}>🔍</span>
      <h1 style={{ fontSize: '3rem', margin: '1rem 0' }}>404 - Page Not Found</h1>
      <p style={{ maxWidth: '500px', margin: '0 auto 2rem auto', color: 'var(--text-secondary)' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to={APP_ROUTES.PUBLIC.HOME} className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
