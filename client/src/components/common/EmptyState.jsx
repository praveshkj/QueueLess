import React from 'react';

export const EmptyState = ({
  icon = '📋',
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
