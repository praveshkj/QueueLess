import React from 'react';

export const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner" />
      {message && (
        <p style={{ marginTop: '0.75rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)',
          zIndex: 9999,
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
