import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes.js';

export const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link
            to={APP_ROUTES.PUBLIC.HOME}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
            }}
          >
            <span>⚡</span>
            <span>QueueLess</span>
          </Link>
          <p style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-sm)' }}>
            Digital Queue &amp; Smart Token Management System
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
