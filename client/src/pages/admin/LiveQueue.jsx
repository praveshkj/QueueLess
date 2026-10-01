import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { queueService } from '../../services/queueService.js';
import { serviceService } from '../../services/serviceService.js';
import { counterService } from '../../services/counterService.js';
import { tokenService } from '../../services/tokenService.js';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { TOKEN_STATUS } from '../../constants/tokenStatus.js';
import { formatDateTime } from '../../utils/formatters.js';

export const LiveQueue = () => {
  const [services, setServices] = useState([]);
  const [counters, setCounters] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedCounterId, setSelectedCounterId] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callingNext, setCallingNext] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [servicesRes, countersRes] = await Promise.all([
        serviceService.getAllServices(),
        counterService.getAllCounters(),
      ]);

      if (servicesRes?.data?.services) {
        setServices(servicesRes.data.services);
        if (servicesRes.data.services.length > 0) {
          setSelectedServiceId(servicesRes.data.services[0]._id);
        }
      }

      if (countersRes?.data?.counters) {
        setCounters(countersRes.data.counters);
        if (countersRes.data.counters.length > 0) {
          setSelectedCounterId(countersRes.data.counters[0]._id);
        }
      }
    } catch (err) {
      setError('Initialization failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadQueue = async () => {
    if (!selectedServiceId) return;
    try {
      const res = await queueService.getLiveQueue(selectedServiceId);
      if (res?.data?.queue) {
        setQueue(res.data.queue);
      } else {
        setQueue([]);
      }
    } catch (err) {
      console.warn('Queue refresh warning:', err.message);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadQueue();
  }, [selectedServiceId]);

  // Action: Call Next
  const handleCallNext = async () => {
    if (!selectedCounterId) {
      setError('Please select an active counter before calling next token');
      return;
    }

    setCallingNext(true);
    setError('');
    setMessage('');

    try {
      const res = await queueService.callNextToken(selectedCounterId, selectedServiceId);
      const token = res?.data?.token;
      if (token) {
        setMessage(`Called Token ${token.tokenNumber} to counter desk.`);
      } else {
        setMessage('No eligible waiting tokens in this queue.');
      }
      loadQueue();
    } catch (err) {
      setError(err.message || 'Failed to call next token');
    } finally {
      setCallingNext(false);
    }
  };

  // Action: Start Service
  const handleStartService = async (token) => {
    setActionLoadingId(token._id);
    setError('');
    try {
      await tokenService.updateTokenStatus(token._id, TOKEN_STATUS.IN_SERVICE, selectedCounterId);
      setMessage(`Started service for Token ${token.tokenNumber}.`);
      loadQueue();
    } catch (err) {
      setError(err.message || 'Failed to start service');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Complete
  const handleComplete = async (token) => {
    setActionLoadingId(token._id);
    setError('');
    try {
      await tokenService.updateTokenStatus(token._id, TOKEN_STATUS.COMPLETED);
      setMessage(`Token ${token.tokenNumber} marked as COMPLETED.`);
      loadQueue();
    } catch (err) {
      setError(err.message || 'Failed to complete token');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Mark No-Show
  const handleNoShow = async (token) => {
    setActionLoadingId(token._id);
    setError('');
    try {
      await tokenService.updateTokenStatus(token._id, TOKEN_STATUS.NO_SHOW);
      setMessage(`Token ${token.tokenNumber} marked as NO-SHOW.`);
      loadQueue();
    } catch (err) {
      setError(err.message || 'Failed to mark no-show');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <Loader message="Connecting to live queue dispatcher..." />;
  }

  // Apply Priority and Status filters client-side on fetched queue
  const filteredQueue = queue.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priorityLevel !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <AdminHeader
        title="Live Queue"
        subtitle="Priority-based dispatching with automatic P1/P2/P3 algorithm enforcement"
      />

      <div className="admin-content">
        {/* Controls: Service filter, Counter filter, Priority filter, Status filter */}
        <div className="card mb-6">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end',
            }}
          >
            {/* Service filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="filter-service" className="form-label">
                Service Desk
              </label>
              <select
                id="filter-service"
                className="form-select"
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
            </div>

            {/* Counter filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="filter-counter" className="form-label">
                Counter Desk
              </label>
              <select
                id="filter-counter"
                className="form-select"
                value={selectedCounterId}
                onChange={(e) => setSelectedCounterId(e.target.value)}
              >
                {counters.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.counterName} ({c.isOpen ? 'OPEN' : 'CLOSED'})
                  </option>
                ))}
              </select>
            </div>

            {/* Priority filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="filter-priority" className="form-label">
                Priority Filter
              </label>
              <select
                id="filter-priority"
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="P1">P1 — On-Time Appointment</option>
                <option value="P2">P2 — Walk-In</option>
                <option value="P3">P3 — Late Arrival</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="filter-status" className="form-label">
                Status Filter
              </label>
              <select
                id="filter-status"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value={TOKEN_STATUS.WAITING}>WAITING</option>
                <option value={TOKEN_STATUS.CHECKED_IN}>CHECKED-IN</option>
                <option value={TOKEN_STATUS.IN_SERVICE}>IN SERVICE</option>
              </select>
            </div>
          </div>

          {/* Call Next Button Bar */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Priority sorting automatically enforces: <strong>P1 &gt; P2 &gt; P3</strong>, then FIFO by check-in time.
            </div>
            <Button
              variant="primary"
              onClick={handleCallNext}
              loading={callingNext}
              disabled={!selectedCounterId || !selectedServiceId}
            >
              📢 Call Next
            </Button>
          </div>
        </div>

        {message && <div className="alert alert-info">{message}</div>}
        <ErrorMessage message={error} />

        {/* Queue Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Active Queue Dispatches</h3>

          {filteredQueue.length > 0 ? (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Priority</th>
                    <th>Check-In Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((token) => (
                    <tr key={token._id}>
                      <td>
                        <strong>{token.tokenNumber}</strong>
                      </td>
                      <td>{token.userId?.name || 'Walk-In Customer'}</td>
                      <td>{token.serviceId?.serviceName || '--'}</td>
                      <td>
                        <span className={`badge badge-${token.priorityLevel.toLowerCase()}`}>
                          {token.priorityLevel}
                        </span>
                      </td>
                      <td>
                        {token.checkInTime ? formatDateTime(token.checkInTime) : '--'}
                      </td>
                      <td>
                        <span className={`badge badge-${token.status.toLowerCase()}`}>
                          {token.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {token.status !== TOKEN_STATUS.IN_SERVICE && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartService(token)}
                              disabled={actionLoadingId === token._id}
                            >
                              Start Service
                            </Button>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleComplete(token)}
                            disabled={actionLoadingId === token._id}
                          >
                            Complete
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleNoShow(token)}
                            disabled={actionLoadingId === token._id}
                          >
                            Mark No-Show
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="⏱️"
              title="No tokens match the criteria"
              description="There are currently no active tokens in this service queue with the selected filters."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveQueue;
