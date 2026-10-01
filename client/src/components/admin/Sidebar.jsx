import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { APP_ROUTES } from '../../constants/routes.js';

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: APP_ROUTES.ADMIN.DASHBOARD, icon: '📊' },
    { label: 'Live Queue', path: APP_ROUTES.ADMIN.QUEUE, icon: '⏱️' },
    { label: 'Services', path: APP_ROUTES.ADMIN.SERVICES, icon: '🏥' },
    { label: 'Counters', path: APP_ROUTES.ADMIN.COUNTERS, icon: '🖥️' },
    { label: 'Appointments', path: APP_ROUTES.ADMIN.APPOINTMENTS, icon: '📅' },
    { label: 'Tokens', path: APP_ROUTES.ADMIN.TOKENS, icon: '🎫' },
    { label: 'Analytics', path: APP_ROUTES.ADMIN.ANALYTICS, icon: '📈' },
  ];

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.PUBLIC.LOGIN);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <div>
            <h3 style={{ color: 'var(--text-white)', fontSize: '1.125rem', margin: 0 }}>QueueLess</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-sidebar-muted)' }}>
              Admin Console
            </span>
          </div>
        </div>
      </div>

      <ul className="admin-nav">
        {navItems.map((item) => (
          <li key={item.path} className="admin-nav-item">
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleLogout}
          className="admin-logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-sidebar-muted)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 500,
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-danger)';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-sidebar-muted)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
