import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters.js';
import { PRIORITY_LABELS } from '../../constants/priorityLevels.js';
import { APP_ROUTES } from '../../constants/routes.js';

export const TokenCard = ({ token, waitEstimation }) => {
  const statusClass = `badge-${token.status.toLowerCase()}`;
  const priorityClass = `badge-${token.priorityLevel.toLowerCase()}`;

  return (
    <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            TOKEN NUMBER
          </span>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)' }}>
            {token.tokenNumber}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
          <span className={`badge ${statusClass}`}>{token.status.replace('_', ' ')}</span>
          <span className={`badge ${priorityClass}`}>{token.priorityLevel}</span>
        </div>
      </div>

      <div style={{ fontSize: 'var(--font-size-sm)', margin: '0.75rem 0' }}>
        <p><strong>Service:</strong> {token.serviceId?.serviceName || 'General Service'}</p>
        <p><strong>Priority Tier:</strong> {PRIORITY_LABELS[token.priorityLevel] || token.priorityLevel}</p>
        <p><strong>Check-In Time:</strong> {formatDateTime(token.checkInTime || token.createdAt)}</p>
        {token.counterId && (
          <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Assigned Counter: {token.counterId.counterName}
          </p>
        )}
      </div>

      {waitEstimation && (
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Ahead in line:</span>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            {waitEstimation.customersAhead} {waitEstimation.customersAhead === 1 ? 'person' : 'people'}
          </span>
        </div>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <Link
          to={`/customer/tokens/${token._id}`}
          className="btn btn-outline btn-sm"
          style={{ width: '100%' }}
        >
          View Full Live Status
        </Link>
      </div>
    </div>
  );
};
