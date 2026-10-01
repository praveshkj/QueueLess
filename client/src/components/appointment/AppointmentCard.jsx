import React from 'react';
import { formatDateTime } from '../../utils/formatters.js';
import { Button } from '../common/Button.jsx';


export const AppointmentCard = ({ appointment, onCheckIn, onCancel }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{appointment.serviceId?.serviceName || 'Scheduled Service'}</h3>
          <span className="card-subtitle">
            Slot: {formatDateTime(appointment.slotTime)}
          </span>
        </div>
        <span className="badge badge-waiting">{appointment.status}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        {appointment.status === 'SCHEDULED' && onCheckIn && (
          <Button variant="primary" size="sm" onClick={() => onCheckIn(appointment)}>
            Check-In &amp; Issue Token (P1)
          </Button>
        )}
        {appointment.status === 'SCHEDULED' && onCancel && (
          <Button variant="outline" size="sm" onClick={() => onCancel(appointment)}>
            Cancel Slot
          </Button>
        )}
      </div>
    </div>
  );
};
