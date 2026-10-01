import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { Button } from '../../components/common/Button.jsx';
import { APP_ROUTES } from '../../constants/routes.js';

export const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await serviceService.getAllServices();
        if (response?.data?.services) {
          setServices(response.data.services);
        } else {
          setServices([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load services list');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleJoinQueue = (service) => {
    navigate(APP_ROUTES.CUSTOMER.WALK_IN, { state: { selectedServiceId: service._id } });
  };

  const handleBookAppointment = (service) => {
    navigate(APP_ROUTES.CUSTOMER.BOOK_APPOINTMENT, { state: { selectedServiceId: service._id } });
  };

  if (loading) {
    return <Loader message="Fetching available services..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Choose a Service</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Select the service you need to join a queue or book an appointment.
        </p>
      </div>

      <ErrorMessage message={error} />

      {services.length > 0 ? (
        <div className="grid-3">
          {services.map((service) => (
            <div key={service._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{service.serviceName}</h3>
                <span className={`badge ${service.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                  {service.isActive ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {service.description && (
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
                  {service.description}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span>⏱️</span>
                <span>Average Service Time: <strong>~{service.avgServiceTime} min</strong></span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleJoinQueue(service)}
                  disabled={!service.isActive}
                >
                  Join Queue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBookAppointment(service)}
                  disabled={!service.isActive}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🏥"
          title="No services found"
          description="There are currently no active services configured in the system."
        />
      )}
    </div>
  );
};

export default Services;
