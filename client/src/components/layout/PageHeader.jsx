import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`page-header flex-between mb-6 ${className}`}
      style={{
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        ...style,
      }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', margin: 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
