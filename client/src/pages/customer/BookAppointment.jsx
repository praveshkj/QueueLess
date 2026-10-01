import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { serviceService } from '../../services/serviceService.js';
import { appointmentService } from '../../services/appointmentService.js';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { APP_ROUTES } from '../../constants/routes.js';
import { formatDateTime } from '../../utils/formatters.js';

export const BookAppointment = () => {
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(
    location.state?.selectedServiceId || ''
  );
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [error, setError] = useState('');
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await serviceService.getAllServices();
        if (response?.data?.services) {
          const activeServices = response.data.services.filter((s) => s.isActive);
          setServices(activeServices);
          if (!selectedServiceId && activeServices.length > 0) {
            setSelectedServiceId(activeServices[0]._id);
          }
        }
      } catch (err) {
        setError('Failed to fetch services: ' + err.message);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
  }, [selectedServiceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId || !slotDate || !slotTime) {
      setError('Please select a service, date, and appointment time');
      return;
    }

    const combinedDateTime = new Date(`${slotDate}T${slotTime}`);
    if (combinedDateTime <= new Date()) {
      setError('Appointment time must be in the future');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await appointmentService.bookAppointment({
        serviceId: selectedServiceId,
        slotTime: combinedDateTime.toISOString(),
      });
      if (response?.data?.appointment) {
        setBookedAppointment(response.data.appointment);
      } else {
        throw new Error('Server returned an empty appointment confirmation');
      }
    } catch (err) {
      setError(err.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingServices) {
    return <Loader message="Loading available appointment desks..." />;
  }

  const selectedService = services.find((s) => s._id === selectedServiceId);

  // SUCCESS CONFIRMATION VIEW
  if (bookedAppointment) {
    return (
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-completed" style={{ marginBottom: '0.75rem' }}>
            Confirmed
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Appointment Booked</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your appointment has been successfully scheduled.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Appointment Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: 'var(--font-size-sm)' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Service Desk:</span>
              <strong>{bookedAppointment.serviceId?.serviceName || selectedService?.serviceName || 'General Desk'}</strong>
            </div>

            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Scheduled Time:</span>
              <strong>{formatDateTime(bookedAppointment.slotTime)}</strong>
            </div>

            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span className={`badge badge-${bookedAppointment.status.toLowerCase()}`}>
                {bookedAppointment.status}
              </span>
            </div>

            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Priority Level:</span>
              <span className="badge badge-p1">P1 — On-Time Appointment</span>
            </div>
          </div>

          <div
            style={{
              padding: '0.875rem',
              backgroundColor: 'var(--priority-p1-bg)',
              borderRadius: 'var(--radius-md)',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--priority-p1)',
            }}
          >
            ⭐ <strong>Arrival Window:</strong> When you arrive within 15 minutes of your slot time, check in via <strong>My Appointments</strong> to automatically receive Priority Level 1 (P1) ahead of walk-in queues.
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to={APP_ROUTES.CUSTOMER.APPOINTMENTS} className="btn btn-primary btn-sm">
              View All Appointments
            </Link>
            <Link to={APP_ROUTES.CUSTOMER.DASHBOARD} className="btn btn-outline btn-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // BOOKING FORM VIEW
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Book an Appointment</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Reserve a future time slot for VIP priority access (P1) upon arrival.
        </p>
      </div>

      <div className="card">
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          {/* Service Field */}
          <div className="form-group">
            <label htmlFor="apt-service" className="form-label">
              Service
            </label>
            <select
              id="apt-service"
              className="form-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
            >
              <option value="">-- Choose a Service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.serviceName} (~{s.avgServiceTime} mins avg)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Fields */}
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="apt-date" className="form-label">
                Date
              </label>
              <input
                id="apt-date"
                type="date"
                className="form-input"
                value={slotDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSlotDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apt-time" className="form-label">
                Time Slot
              </label>
              <input
                id="apt-time"
                type="time"
                className="form-input"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Live Selection Summary */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              margin: '1.25rem 0',
            }}
          >
            <h4 style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Booking Summary
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: 'var(--font-size-sm)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Selected Service: </span>
                <strong>{selectedService ? selectedService.serviceName : 'None selected'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Selected Date: </span>
                <strong>{slotDate || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Selected Time: </span>
                <strong>{slotTime || 'Not specified'}</strong>
              </div>
            </div>
          </div>

          <Button
            id="book-appointment-btn"
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
            disabled={!selectedServiceId || !slotDate || !slotTime}
          >
            Book Appointment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
