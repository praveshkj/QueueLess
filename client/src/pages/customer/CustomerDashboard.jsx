import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { tokenService } from '../../services/tokenService.js';
import { appointmentService } from '../../services/appointmentService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { APP_ROUTES } from '../../constants/routes.js';
import { TOKEN_STATUS } from '../../constants/tokenStatus.js';
import { formatDateTime } from '../../utils/formatters.js';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeToken, setActiveToken] = useState(null);
  const [activeTokenMeta, setActiveTokenMeta] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [tokensRes, appointmentsRes] = await Promise.allSettled([
          tokenService.getMyTokens(),
          appointmentService.getMyAppointments(),
        ]);

        if (tokensRes.status === 'fulfilled' && tokensRes.value?.data?.tokens) {
          const active = tokensRes.value.data.tokens.find(
            (t) => t.status === TOKEN_STATUS.WAITING || t.status === TOKEN_STATUS.IN_SERVICE
          );

          if (active) {
            setActiveToken(active);
            // Fetch detailed wait estimation from the backend for this active token
            try {
              const detailRes = await tokenService.getTokenById(active._id);
              if (detailRes?.data) {
                setActiveToken(detailRes.data.token || active);
                setActiveTokenMeta(detailRes.data.waitEstimation || null);
              }
            } catch (detailErr) {
              console.warn('Could not fetch token details:', detailErr.message);
            }
          } else {
            setActiveToken(null);
            setActiveTokenMeta(null);
          }
        }

        if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value?.data?.appointments) {
          setAppointments(appointmentsRes.value.data.appointments);
        }
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Loading your dashboard..." />;
  }

  const peopleAhead = activeTokenMeta?.customersAhead ?? (activeToken ? 0 : 0);
  const currentPosition = activeToken ? peopleAhead + 1 : '--';
  const estimatedWait = activeTokenMeta?.estimatedMinutes
    ? `~${activeTokenMeta.estimatedMinutes} min`
    : (activeToken ? '~15 min' : '--');

  const upcomingApt = appointments.find((a) => a.status === 'CONFIRMED' || a.status === 'PENDING');

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          Welcome back, {user?.name || 'Customer'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your queue visits and appointments.
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* SUMMARY CARDS */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <span className="stat-label">Active Token</span>
          <div className="stat-value" style={{ color: activeToken ? 'var(--color-primary)' : 'var(--text-muted)' }}>
            {activeToken ? activeToken.tokenNumber : '--'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {activeToken ? (activeToken.serviceId?.serviceName || 'General') : 'No active token'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Queue Position</span>
          <div className="stat-value" style={{ color: activeToken ? 'var(--color-secondary)' : 'var(--text-muted)' }}>
            {activeToken ? `#${currentPosition}` : '--'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {activeToken ? `${peopleAhead} people ahead` : 'Not in queue'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Estimated Wait</span>
          <div className="stat-value" style={{ color: activeToken ? 'var(--color-warning)' : 'var(--text-muted)' }}>
            {estimatedWait}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {activeToken ? 'Based on desk pace' : 'No wait time'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Upcoming Appointment</span>
          <div className="stat-value" style={{ fontSize: 'var(--font-size-xl)' }}>
            {upcomingApt ? (
              new Date(upcomingApt.slotTime).toLocaleDateString([], { month: 'short', day: 'numeric' })
            ) : (
              'None'
            )}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {upcomingApt ? (
              new Date(upcomingApt.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            ) : (
              'No upcoming slots'
            )}
          </span>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-6">
        <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Quick Actions
        </h3>
        <div className="grid-4">
          <Link
            to={APP_ROUTES.CUSTOMER.WALK_IN}
            className="btn btn-outline"
            style={{ justifyContent: 'center', padding: '0.875rem' }}
          >
            ⚡ Join Walk-In Queue
          </Link>
          <Link
            to={APP_ROUTES.CUSTOMER.BOOK_APPOINTMENT}
            className="btn btn-outline"
            style={{ justifyContent: 'center', padding: '0.875rem' }}
          >
            📅 Book Appointment
          </Link>
          <Link
            to={APP_ROUTES.CUSTOMER.TOKENS}
            className="btn btn-outline"
            style={{ justifyContent: 'center', padding: '0.875rem' }}
          >
            🎫 My Tokens
          </Link>
          <Link
            to={APP_ROUTES.CUSTOMER.QUEUE}
            className="btn btn-outline"
            style={{ justifyContent: 'center', padding: '0.875rem' }}
          >
            📊 View Queue
          </Link>
        </div>
      </div>

      {/* MAIN SECTION: Current Queue */}
      <div className="mb-6">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Current Queue</h2>

        {activeToken ? (
          <div
            className="card"
            style={{
              maxWidth: '650px',
              borderLeft: '4px solid var(--color-primary)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  TOKEN
                </span>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
                  {activeToken.tokenNumber}
                </div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', marginTop: '0.25rem' }}>
                  {activeToken.serviceId?.serviceName || 'General Service'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <span className={`badge badge-${activeToken.status.toLowerCase()}`}>
                  {activeToken.status.replace('_', ' ')}
                </span>
                <span className={`badge badge-${activeToken.priorityLevel.toLowerCase()}`}>
                  {activeToken.priorityLevel === 'P1' && 'Priority: P1 • On-Time'}
                  {activeToken.priorityLevel === 'P2' && 'Priority: P2 • Walk-In'}
                  {activeToken.priorityLevel === 'P3' && 'Priority: P3 • Late'}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Position:</span>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                  #{currentPosition}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>People Ahead:</span>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                  {peopleAhead}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Estimated Wait:</span>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)' }}>
                  {estimatedWait}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Link to={`/customer/tokens/${activeToken._id}`} className="btn btn-primary btn-sm">
                View Full Pass &amp; Details →
              </Link>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: '650px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No active queue</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              You are not currently waiting in any service desk queue.
            </p>
            <Link to={APP_ROUTES.CUSTOMER.WALK_IN} className="btn btn-primary">
              Join a Queue
            </Link>
          </div>
        )}
      </div>

      {/* UPCOMING APPOINTMENTS */}
      <div>
        <div className="flex-between mb-4">
          <h2 style={{ fontSize: '1.5rem' }}>Upcoming Appointments</h2>
          <Link to={APP_ROUTES.CUSTOMER.APPOINTMENTS} className="btn btn-outline btn-sm">
            View All Appointments
          </Link>
        </div>

        {appointments.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((apt) => (
                  <tr key={apt._id}>
                    <td>
                      <strong>{apt.serviceId?.serviceName || 'General Desk'}</strong>
                    </td>
                    <td>{formatDateTime(apt.slotTime)}</td>
                    <td>
                      <span className={`badge badge-${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-p1">P1</span>
                    </td>
                    <td>
                      <Link to={APP_ROUTES.CUSTOMER.APPOINTMENTS} className="btn btn-outline btn-sm">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              No upcoming appointments found.{' '}
              <Link to={APP_ROUTES.CUSTOMER.BOOK_APPOINTMENT} style={{ fontWeight: 600 }}>
                Book an appointment slot now
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
