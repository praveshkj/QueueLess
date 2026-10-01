import React from 'react';
import { Button } from '../common/Button.jsx';

export const CounterCard = ({ counter, onToggleStatus, onCallNext }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">{counter.counterName}</h3>
        <span
          className="badge"
          style={{
            backgroundColor: counter.isOpen ? 'var(--color-success-light)' : 'var(--color-danger-light)',
            color: counter.isOpen ? '#047857' : '#b91c1c',
          }}
        >
          {counter.isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>

      <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: '1.25rem' }}>
        <strong>Assigned Service:</strong> {counter.serviceId?.serviceName || counter.assignedServiceId?.serviceName || 'General Desk'}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        {onCallNext && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onCallNext(counter)}
            disabled={!counter.isOpen}
          >
            Call Next
          </Button>
        )}
        {onToggleStatus && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(counter)}
          >
            {counter.isOpen ? 'Close Desk' : 'Open Desk'}
          </Button>
        )}
      </div>
    </div>
  );
};
