import React from 'react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error" role="alert">
      <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
      <div style={{ flex: 1 }}>{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline btn-sm"
          style={{ borderColor: '#fca5a5', color: '#991b1b' }}
        >
          Retry
        </button>
      )}
    </div>
  );
};
