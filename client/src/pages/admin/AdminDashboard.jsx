import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { analyticsService } from '../../services/analyticsService.js';
import { serviceService } from '../../services/serviceService.js';
import { queueService } from '../../services/queueService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { APP_ROUTES } from '../../constants/routes.js';
import { formatDateTime } from '../../utils/formatters.js';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [liveQueuePreview, setLiveQueuePreview] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminOverview = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, servicesRes] = await Promise.allSettled([
          analyticsService.getOverviewStats(),
          serviceService.getAllServices(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data?.stats) {
          setStats(statsRes.value.data.stats);
        } else {
          setStats(null);
        }

        if (servicesRes.status === 'fulfilled' && servicesRes.value?.data?.services?.length > 0) {
          const serviceList = servicesRes.value.data.services;
          setServices(serviceList);
          // Fetch queue for first service for preview
          try {
            const queueRes = await queueService.getLiveQueue(serviceList[0]._id);
            if (queueRes?.data?.queue) {
              setLiveQueuePreview(queueRes.data.queue.slice(0, 5));
            }
          } catch (qErr) {
            console.warn('Queue preview notice:', qErr.message);
          }
        }
      } catch (err) {
        setError(err.message || 'Unable to load administration overview');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  if (loading) {
    return <Loader message="Loading administrator dashboard..." />;
  }

  // Calculate Active Tokens (waiting + in service)
  const waitingCount = stats?.waitingTokens !== undefined ? stats.waitingTokens : '--';
  const completedCount = stats?.completedTokens !== undefined ? stats.completedTokens : '--';
  const noShowsCount = stats?.noShowTokens !== undefined ? stats.noShowTokens : '--';
  // In service tokens can be computed from preview or active stats
  const inServiceCount = liveQueuePreview.filter((t) => t.status === 'IN_SERVICE').length;
  const activeTokensCount = typeof waitingCount === 'number' ? waitingCount + inServiceCount : '--';

  return (
    <div>
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Monitor and manage today's queue operations."
      />

      <div className="admin-content">
        <ErrorMessage message={error} />

        {/* 5 STAT CARDS: Active Tokens, Waiting, In Service, Completed, No-Shows */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div className="stat-card">
            <span className="stat-label">Active Tokens</span>
            <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
              {activeTokensCount}
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Currently in system
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Waiting</span>
            <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
              {waitingCount}
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              In queue line
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">In Service</span>
            <div className="stat-value" style={{ color: 'var(--color-info)' }}>
              {inServiceCount}
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              At counter desks
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <div className="stat-value" style={{ color: 'var(--color-success)' }}>
              {completedCount}
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Served customers
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">No-Shows</span>
            <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
              {noShowsCount}
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
              Missed token calls
            </span>
          </div>
        </div>

        {/* LIVE QUEUE PREVIEW */}
        <div className="card">
          <div className="flex-between mb-4">
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Live Queue Preview</h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', margin: 0 }}>
                {services.length > 0 ? `Showing active queue for: ${services[0].serviceName}` : 'All services'}
              </p>
            </div>
            <Link to={APP_ROUTES.ADMIN.QUEUE} className="btn btn-primary btn-sm">
              Open Full Orchestrator →
            </Link>
          </div>

          {liveQueuePreview.length > 0 ? (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Wait Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveQueuePreview.map((token) => (
                    <tr key={token._id}>
                      <td>
                        <strong>{token.tokenNumber}</strong>
                      </td>
                      <td>{token.userId?.name || 'Walk-In'}</td>
                      <td>{token.serviceId?.serviceName || '--'}</td>
                      <td>
                        <span className={`badge badge-${token.priorityLevel.toLowerCase()}`}>
                          {token.priorityLevel}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${token.status.toLowerCase()}`}>
                          {token.status}
                        </span>
                      </td>
                      <td>{token.checkInTime ? formatDateTime(token.checkInTime) : '--'}</td>
                      <td>
                        <Link to={APP_ROUTES.ADMIN.QUEUE} className="btn btn-outline btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0 }}>No active tokens waiting in queue at this moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
