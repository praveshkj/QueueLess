import React from 'react';

export const StatCard = ({ label, value, subtext, icon, color = 'var(--color-primary)' }) => {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="stat-label">{label}</span>
        {icon && (
          <span
            style={{
              fontSize: '1.25rem',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
      {subtext && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          {subtext}
        </span>
      )}
    </div>
  );
};
