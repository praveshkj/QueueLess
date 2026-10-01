import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tokenService } from '../../services/tokenService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { formatDateTime } from '../../utils/formatters.js';
import { APP_ROUTES } from '../../constants/routes.js';

export const TokenDetails = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [waitEstimation, setWaitEstimation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await tokenService.getTokenById(id);
        if (response?.data?.token) {
          setToken(response.data.token);
          setWaitEstimation(response.data.waitEstimation || null);
        } else {
          setError('Token details could not be retrieved');
        }
      } catch (err) {
        setError(err.message || 'Failed to load token details');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [id]);

  if (loading) {
    return <Loader message="Fetching token details..." />;
  }

  if (error || !token) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <ErrorMessage message={error || 'Token not found'} />
        <Link to={APP_ROUTES.CUSTOMER.TOKENS} className="btn btn-outline btn-sm">
          ← Back to My Tokens
        </Link>
      </div>
    );
  }

  const peopleAhead = waitEstimation?.customersAhead ?? 0;
  const queuePosition = peopleAhead + 1;
  const estimatedWait = waitEstimation?.estimatedMinutes
    ? `~${waitEstimation.estimatedMinutes} min`
    : `~${token.serviceId?.avgServiceTime || 15} min`;

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div className="flex-between mb-4">
        <Link to={APP_ROUTES.CUSTOMER.TOKENS} className="btn btn-outline btn-sm">
          ← Back to My Tokens
        </Link>
        <span className={`badge badge-${token.status.toLowerCase()}`}>
          {token.status.replace('_', ' ')}
        </span>
      </div>

      {/* Prominent Digital Token Card */}
      <div
        className="card mb-6"
        style={{
          textAlign: 'center',
          padding: '2.5rem 2rem',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-main) 100%)',
        }}
      >
        <span style={{ fontSize: 'var(--font-size-xs)', letterSpacing: '0.075em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
          OFFICIAL DIGITAL TOKEN PASS
        </span>

        <h1
          style={{
            fontSize: '4.5rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            fontFamily: 'monospace',
            lineHeight: 1.1,
            margin: '0.5rem 0',
          }}
        >
          {token.tokenNumber}
        </h1>

        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {token.serviceId?.serviceName || 'General Service Desk'}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <span className={`badge badge-${token.priorityLevel.toLowerCase()}`}>
            {token.priorityLevel === 'P1' && 'Priority: P1 — On-Time Appointment'}
            {token.priorityLevel === 'P2' && 'Priority: P2 — Walk-In'}
            {token.priorityLevel === 'P3' && 'Priority: P3 — Late Arrival'}
          </span>
          <span className={`badge badge-${token.status.toLowerCase()}`}>
            {token.status}
          </span>
        </div>

        {/* Live Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1rem',
          }}
        >
          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block' }}>
              Queue Position
            </span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>
              #{queuePosition}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block' }}>
              People Ahead
            </span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              {peopleAhead}
            </strong>
          </div>

          <div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block' }}>
              Estimated Wait
            </span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
              {estimatedWait}
            </strong>
          </div>
        </div>
      </div>

      {/* Check-In and Metadata Details */}
      <div className="card mb-6">
        <h3 className="card-title mb-4">Token Status &amp; Check-In Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: 'var(--font-size-sm)' }}>
          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)' }}>Check-in Status:</span>
            <strong>
              {token.checkInTime ? (
                <span style={{ color: 'var(--color-success)' }}>
                  ✅ Checked In ({formatDateTime(token.checkInTime)})
                </span>
              ) : (
                <span style={{ color: 'var(--color-warning)' }}>
                  ⏳ Awaiting Check-In
                </span>
              )}
            </strong>
          </div>

          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)' }}>Assigned Counter:</span>
            <strong>{token.counterId?.counterName || 'Not yet dispatched to a counter desk'}</strong>
          </div>

          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)' }}>Appointment Information:</span>
            <strong>
              {token.appointmentId ? (
                `Linked to Appointment (#${typeof token.appointmentId === 'object' ? token.appointmentId._id.slice(-6) : token.appointmentId.slice(-6)})`
              ) : (
                'Walk-In Direct Generation'
              )}
            </strong>
          </div>

          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)' }}>Token Generated:</span>
            <strong>{formatDateTime(token.createdAt)}</strong>
          </div>

          {token.calledAt && (
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Called To Desk:</span>
              <strong>{formatDateTime(token.calledAt)}</strong>
            </div>
          )}

          {token.servedAt && (
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Service Completed:</span>
              <strong>{formatDateTime(token.servedAt)}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Action Links */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to={APP_ROUTES.CUSTOMER.QUEUE} className="btn btn-outline btn-sm">
          📊 View Public Live Queue
        </Link>
        <Link to={APP_ROUTES.CUSTOMER.DASHBOARD} className="btn btn-primary btn-sm">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default TokenDetails;
