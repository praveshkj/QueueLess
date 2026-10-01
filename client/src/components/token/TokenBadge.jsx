import React from 'react';
import { TOKEN_STATUS_COLORS } from '../../constants/tokenStatus.js';

export const TokenBadge = ({ status }) => {
  const color = TOKEN_STATUS_COLORS[status] || '#6b7280';
  return (
    <span
      className="badge"
      style={{
        backgroundColor: `${color}1A`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
};
