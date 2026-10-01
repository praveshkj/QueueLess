import React from 'react';

export const LiveQueueView = ({ queue, serviceName }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Live Queue &bull; {serviceName || 'Active Service'}</h3>
        <span className="badge badge-in_service">Live Synced</span>
      </div>
      <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
        Current real-time waiting line sorted by priority (P1 on-time &gt; P2 walk-in &gt; P3 late) and check-in time.
      </p>
      {queue && queue.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {queue.map((t, idx) => (
            <div
              key={t._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <strong>#{idx + 1} &bull; {t.tokenNumber}</strong>
                <span style={{ marginLeft: '0.5rem', fontSize: 'var(--font-size-xs)' }}>
                  ({t.userId?.name || 'Walk-In'})
                </span>
              </div>
              <span className={`badge badge-${t.priorityLevel.toLowerCase()}`}>
                {t.priorityLevel}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
          Queue is currently empty.
        </p>
      )}
    </div>
  );
};
