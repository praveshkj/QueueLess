import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/routes.js';

export const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <span style={{ fontSize: '4rem' }}>🛑</span>
      <h1 style={{ fontSize: '2.5rem', margin: '1rem 0', color: 'var(--color-danger)' }}>
        403 - Access Denied
      </h1>
      <p style={{ maxWidth: '480px', margin: '0 auto 2rem auto', color: 'var(--text-secondary)' }}>
        You do not have administrative permissions to view this resource. If you believe this is an error, please contact your administrator.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to={APP_ROUTES.CUSTOMER.DASHBOARD} className="btn btn-primary">
          Customer Dashboard
        </Link>
        <Link to={APP_ROUTES.PUBLIC.HOME} className="btn btn-outline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
