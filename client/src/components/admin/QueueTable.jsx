import React from 'react';
import { formatTime } from '../../utils/formatters.js';
import { Button } from '../common/Button.jsx';
import { TOKEN_STATUS } from '../../constants/tokenStatus.js';

export const QueueTable = ({ tokens, onCallToken, onCompleteToken, onNoShowToken }) => {
  if (!tokens || tokens.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No tokens in this queue.
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Customer</th>
            <th>Priority</th>
            <th>Check-in</th>
            <th>Status</th>
            <th>Assigned Counter</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token._id}>
              <td>
                <strong style={{ color: 'var(--color-primary)' }}>{token.tokenNumber}</strong>
              </td>
              <td>{token.userId?.name || 'Walk-In Customer'}</td>
              <td>
                <span className={`badge badge-${token.priorityLevel.toLowerCase()}`}>
                  {token.priorityLevel}
                </span>
              </td>
              <td>{formatTime(token.checkInTime || token.createdAt)}</td>
              <td>
                <span className={`badge badge-${token.status.toLowerCase()}`}>
                  {token.status.replace('_', ' ')}
                </span>
              </td>
              <td>{token.counterId?.counterName || '—'}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {token.status === TOKEN_STATUS.WAITING && onCallToken && (
                    <Button variant="primary" size="sm" onClick={() => onCallToken(token)}>
                      Call
                    </Button>
                  )}
                  {token.status === TOKEN_STATUS.IN_SERVICE && onCompleteToken && (
                    <Button variant="outline" size="sm" onClick={() => onCompleteToken(token)}>
                      Complete
                    </Button>
                  )}
                  {(token.status === TOKEN_STATUS.WAITING || token.status === TOKEN_STATUS.IN_SERVICE) && onNoShowToken && (
                    <Button variant="danger" size="sm" onClick={() => onNoShowToken(token)}>
                      No Show
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
