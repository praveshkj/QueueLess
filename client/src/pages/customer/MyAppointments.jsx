import React, { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService.js';
import { AppointmentCard } from '../../components/appointment/AppointmentCard.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { tokenService } from '../../services/tokenService.js';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/routes.js';

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getMyAppointments();
      if (response?.data?.appointments) {
        setAppointments(response.data.appointments);
      }
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCheckIn = async (appointment) => {
    try {
      const res = await tokenService.checkInAppointment(appointment._id);
      const token = res?.data?.token;
      setMessage(`Checked in! Your token is ${token?.tokenNumber}. Priority Level: ${token?.priorityLevel}`);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Check-in failed');
    }
  };

  const handleCancel = async (appointment) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancelAppointment(appointment._id);
      setMessage('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Cancellation failed');
    }
  };

  if (loading) return <Loader message="Loading your appointments..." />;

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1>My Appointments</h1>
          <p>View, check-in to, or cancel your scheduled service appointments.</p>
        </div>
        <Link to={APP_ROUTES.CUSTOMER.BOOK_APPOINTMENT} className="btn btn-primary btn-sm">
          + Book New Slot
        </Link>
      </div>

      {message && <div className="alert alert-success mb-4">{message}</div>}
      <ErrorMessage message={error} />

      {appointments.length > 0 ? (
        <div className="grid-2">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              onCheckIn={handleCheckIn}
              onCancel={handleCancel}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📅"
          title="No appointments scheduled"
          description="Book a future time slot to receive Priority Level 1 (P1) queue access when you arrive."
          actionText="Book an Appointment"
          onAction={() => (window.location.href = APP_ROUTES.CUSTOMER.BOOK_APPOINTMENT)}
        />
      )}
    </div>
  );
};

export default MyAppointments;
