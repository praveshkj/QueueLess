import React from 'react';

export const QueuePosition = ({ position, totalWaiting }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
      }}
    >
      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Current Position In Line
      </span>
      <div
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          color: position === 1 ? 'var(--color-success)' : 'var(--color-primary)',
          lineHeight: 1.1,
          margin: '0.5rem 0',
        }}
      >
        #{position}
      </div>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        {position === 1
          ? 'You are next in line! Please proceed to the service desk when called.'
          : `${position - 1} customer${position - 1 === 1 ? '' : 's'} ahead of you out of ${totalWaiting} total waiting.`}
      </p>
    </div>
  );
};
