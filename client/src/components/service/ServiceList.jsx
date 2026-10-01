import React from 'react';
import { ServiceCard } from '../customer/ServiceCard.jsx';

export const ServiceList = ({ services, onSelectWalkIn, onBookAppointment }) => {
  if (!services || services.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
        No services currently available.
      </div>
    );
  }

  return (
    <div className="grid-3">
      {services.map((service) => (
        <ServiceCard
          key={service._id}
          service={service}
          onSelectWalkIn={onSelectWalkIn}
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
};
