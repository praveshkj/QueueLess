import React from 'react';
import { Button } from '../common/Button.jsx';

export const ServiceCard = ({ service, onSelectWalkIn, onBookAppointment }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 className="card-title">{service.serviceName}</h3>
          <span className="card-subtitle">
            Avg Duration: ~{service.avgServiceTime} mins per customer
          </span>
        </div>
        <span
          className="badge"
          style={{
            backgroundColor: service.isActive ? 'var(--color-success-light)' : 'var(--bg-subtle)',
            color: service.isActive ? '#047857' : 'var(--text-muted)',
          }}
        >
          {service.isActive ? 'Active' : 'Closed'}
        </span>
      </div>

      <p style={{ flex: 1, fontSize: 'var(--font-size-sm)', marginBottom: '1.25rem' }}>
        {service.description || 'Standard service desk for inquiries and processing.'}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
        {onSelectWalkIn && (
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onSelectWalkIn(service)}
            disabled={!service.isActive}
          >
            Get Walk-In Token
          </Button>
        )}
        {onBookAppointment && (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onBookAppointment(service)}
            disabled={!service.isActive}
          >
            Schedule Slot
          </Button>
        )}
      </div>
    </div>
  );
};
