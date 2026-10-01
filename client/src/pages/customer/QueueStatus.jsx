import React, { useEffect, useState } from 'react';
import { serviceService } from '../../services/serviceService.js';
import { queueService } from '../../services/queueService.js';
import { tokenService } from '../../services/tokenService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { TOKEN_STATUS } from '../../constants/tokenStatus.js';

export const QueueStatus = () => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [queue, setQueue] = useState([]);
  const [myActiveToken, setMyActiveToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load services and user's active tokens
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError('');
      try {
        const [servicesRes, myTokensRes] = await Promise.allSettled([
          serviceService.getAllServices(),
          tokenService.getMyTokens(),
        ]);

        let serviceList = [];
        if (servicesRes.status === 'fulfilled' && servicesRes.value?.data?.services) {
          serviceList = servicesRes.value.data.services.filter((s) => s.isActive);
          setServices(serviceList);
        }

        let userToken = null;
        if (myTokensRes.status === 'fulfilled' && myTokensRes.value?.data?.tokens) {
          userToken = myTokensRes.value.data.tokens.find(
            (t) => t.status === TOKEN_STATUS.WAITING || t.status === TOKEN_STATUS.IN_SERVICE
          );
          setMyActiveToken(userToken || null);
        }

        // Default to service of active token or first service
        if (userToken?.serviceId?._id) {
          setSelectedServiceId(userToken.serviceId._id);
        } else if (serviceList.length > 0) {
          setSelectedServiceId(serviceList[0]._id);
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize live queue monitor');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load queue for selected service
  useEffect(() => {
    const fetchQueue = async () => {
      if (!selectedServiceId) return;
      try {
        const res = await queueService.getLiveQueue(selectedServiceId);
        if (res?.data?.queue) {
          setQueue(res.data.queue);
        } else {
          setQueue([]);
        }
      } catch (err) {
        console.warn('Live queue fetch warning:', err.message);
        setQueue([]);
      }
    };

    fetchQueue();
    // Refresh queue every 15 seconds
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [selectedServiceId]);

  if (loading) {
    return <Loader message="Connecting to live queue board..." />;
  }

  const selectedService = services.find((s) => s._id === selectedServiceId);

  // Check if my active token belongs to this service
  const myTokenInQueue = myActiveToken && (
    (typeof myActiveToken.serviceId === 'object' ? myActiveToken.serviceId._id : myActiveToken.serviceId) === selectedServiceId
  );

  // Find index of user's token in the queue
  const myQueueIndex = myTokenInQueue
    ? queue.findIndex((t) => t._id === myActiveToken._id)
    : -1;

  const peopleAheadCount = myQueueIndex > 0 ? myQueueIndex : 0;
  const currentPositionNumber = myQueueIndex >= 0 ? myQueueIndex + 1 : '--';
  const estimatedWaitMinutes = myQueueIndex >= 0
    ? myQueueIndex * (selectedService?.avgServiceTime || 15)
    : '--';

  const tokensAhead = myQueueIndex > 0 ? queue.slice(0, myQueueIndex) : [];
  const currentlyServingToken = queue.find((t) => t.status === TOKEN_STATUS.IN_SERVICE) || queue[0];

  return (
    <div>
      {/* Heading */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Live Queue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor live queue tokens, counter dispatches, and your wait progress in real time.
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* Service Selector */}
      <div className="card mb-6" style={{ maxWidth: '500px' }}>
        <label htmlFor="queue-service-select" className="form-label">
          Select Service Desk:
        </label>
        <select
          id="queue-service-select"
          className="form-select"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
        >
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.serviceName} (~{s.avgServiceTime}m avg)
            </option>
          ))}
        </select>
      </div>

      {/* METRICS DISPLAY (Shows Current Token, People Ahead, Position, Estimated Wait, Service, Counter, Status) */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <span className="stat-label">Currently Serving</span>
          <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
            {currentlyServingToken ? currentlyServingToken.tokenNumber : '--'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            Counter: {currentlyServingToken?.counterId?.counterName || 'Counter Desk'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">People Ahead</span>
          <div className="stat-value" style={{ color: myTokenInQueue ? 'var(--color-secondary)' : 'var(--text-muted)' }}>
            {myTokenInQueue ? peopleAheadCount : '--'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {myTokenInQueue ? 'Eligible ahead of you' : 'No active token'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Current Position</span>
          <div className="stat-value">
            {myTokenInQueue ? `#${currentPositionNumber}` : '--'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {myTokenInQueue ? `Out of ${queue.length} in line` : 'Not in line'}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Estimated Wait</span>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {myTokenInQueue ? `~${estimatedWaitMinutes}m` : '--'}
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            {selectedService?.serviceName || 'Service Desk'}
          </span>
        </div>
      </div>

      {/* VISUAL QUEUE PROGRESS INDICATOR */}
      {myTokenInQueue && (
        <div
          className="card mb-6"
          style={{
            borderLeft: '4px solid var(--color-primary)',
            background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              You are here
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
              ↓
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
              Token {myActiveToken.tokenNumber}
            </div>
            <span className={`badge badge-${myActiveToken.status.toLowerCase()}`}>
              Status: {myActiveToken.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                Tokens Ahead in Line:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {tokensAhead.length > 0 ? (
                  tokensAhead.map((t) => (
                    <span
                      key={t._id}
                      style={{
                        padding: '0.35rem 0.65rem',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {t.tokenNumber}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)', fontWeight: 600 }}>
                    You are next in line! 🎉
                  </span>
                )}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                Your Turn Target:
              </span>
              <div style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-sm)' }}>
                <strong>Token {myActiveToken.tokenNumber}</strong>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 'var(--font-size-xs)' }}>
                  Service: {selectedService?.serviceName} &bull; Counter: {myActiveToken.counterId?.counterName || 'Desk Assignment Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL LIVE QUEUE TABLE */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Live Queue List ({selectedService?.serviceName || 'Service'})
        </h3>

        {queue.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Token</th>
                  <th>Customer</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Counter Desk</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((tokenItem, index) => {
                  const isMine = myActiveToken && tokenItem._id === myActiveToken._id;
                  return (
                    <tr
                      key={tokenItem._id}
                      style={{
                        backgroundColor: isMine ? 'var(--color-primary-light)' : 'transparent',
                        fontWeight: isMine ? 600 : 'normal',
                      }}
                    >
                      <td>#{index + 1}</td>
                      <td>
                        <strong style={{ color: isMine ? 'var(--color-primary)' : 'inherit' }}>
                          {tokenItem.tokenNumber} {isMine && '👈 (You)'}
                        </strong>
                      </td>
                      <td>{tokenItem.userId?.name || 'Walk-In Visitor'}</td>
                      <td>
                        <span className={`badge badge-${tokenItem.priorityLevel.toLowerCase()}`}>
                          {tokenItem.priorityLevel}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${tokenItem.status.toLowerCase()}`}>
                          {tokenItem.status}
                        </span>
                      </td>
                      <td>{tokenItem.counterId?.counterName || '--'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="⏱️"
            title="Queue is empty"
            description="There are currently no waiting or active tokens in this service queue."
          />
        )}
      </div>
    </div>
  );
};

export default QueueStatus;
