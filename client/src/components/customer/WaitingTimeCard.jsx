import React from 'react';
import { formatWaitTime } from '../../utils/formatters.js';

export const WaitingTimeCard = ({ estimatedMinutes, avgServiceTime, customersAhead }) => {
  return (
    <div
      className="card"
      style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        color: 'white',
      }}
    >
      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, opacity: 0.9, textTransform: 'uppercase' }}>
        AI-Ready Wait Time Estimation
      </span>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.25rem 0', color: 'white' }}>
        {formatWaitTime(estimatedMinutes)}
      </h2>
      <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9, marginTop: '0.5rem' }}>
        Based on {customersAhead || 0} customers ahead × {avgServiceTime || 15}m average service speed.
      </p>
    </div>
  );
};
