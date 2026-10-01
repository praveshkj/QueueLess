import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/Button.jsx';

export const AdminHeader = ({ title, subtitle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="admin-top-header">
      <div>
        <h1 style={{ fontSize: 'var(--font-size-xl)' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 'var(--font-size-xs)' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="user-pill">
          <span style={{ fontSize: '1rem' }}>👤</span>
          <span className="user-name">{user?.name || 'Administrator'}</span>
          <span className="badge badge-p1" style={{ fontSize: '0.65rem' }}>
            {user?.role}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};
