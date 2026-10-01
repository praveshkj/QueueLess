import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { analyticsService } from '../../services/analyticsService.js';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';

export const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await analyticsService.getOverviewStats();
        if (res?.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve analytics overview');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader message="Compiling queue analytics..." />;
  }

  const totalTokens = stats?.totalTokens ?? '--';
  const completedTokens = stats?.completedTokens ?? '--';
  const waitingTokens = stats?.waitingTokens ?? '--';
  const cancelledTokens = stats?.cancelledTokens ?? '--';
  const noShowTokens = stats?.noShowTokens ?? '--';
  const throughputRate = stats?.throughputRate !== undefined ? `${stats.throughputRate}%` : '--';

  return (
    <div>
      <AdminHeader
        title="Admin Analytics"
        subtitle="Operational metrics, throughput performance, and queue velocity reporting"
      />

      <div className="admin-content">
        <ErrorMessage message={error} />

        {/* 1. Queue Overview */}
        <section className="mb-6">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Queue Overview</h2>
          <div className="grid-3">
            <div className="stat-card">
              <span className="stat-label">Total Tokens Issued</span>
              <div className="stat-value">{totalTokens}</div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                All tokens recorded in database
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Overall Throughput Rate</span>
              <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
                {throughputRate}
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                Ratio of served vs total created
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">System State</span>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--color-success)' }}>
                ONLINE
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                Real data ingestion operational
              </span>
            </div>
          </div>
        </section>

        {/* 2. Service Performance */}
        <section className="mb-6">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Service Performance</h2>
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--font-size-sm)' }}>
              <div className="flex-between">
                <span>Completed Consultations:</span>
                <strong>{completedTokens}</strong>
              </div>
              <div className="flex-between">
                <span>Average Target Velocity:</span>
                <strong>~15 minutes per customer</strong>
              </div>
              <div className="flex-between">
                <span>Per-Desk Disaggregated Breakdown:</span>
                <span className="badge" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                  Coming in next analytics release
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Waiting Time */}
        <section className="mb-6">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Waiting Time</h2>
          <div className="card">
            <div className="flex-between mb-4">
              <div>
                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Algorithmic Projection Engine</h3>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', margin: 0 }}>
                  Current active formula: Customers Ahead × Average Service Time
                </p>
              </div>
              <span className="badge badge-completed">Linear Engine Active</span>
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              ℹ️ The system records <code>checkInTime</code>, <code>calledAt</code>, and <code>servedAt</code> for all tokens. In Phase 3, this data feed will directly train predictive AI/ML models without changing any API contract.
            </div>
          </div>
        </section>

        {/* 4. Token Status */}
        <section className="mb-6">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Token Status</h2>
          <div className="grid-4">
            <div className="card">
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Waiting / In Line</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '0.25rem' }}>
                {waitingTokens}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Completed</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
                {completedTokens}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Cancelled</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {cancelledTokens}
              </div>
            </div>

            <div className="card">
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>No-Show</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '0.25rem' }}>
                {noShowTokens}
              </div>
            </div>
          </div>
        </section>

        {/* 5. No-Show Statistics */}
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No-Show Statistics</h2>
          <div className="card">
            <div className="flex-between">
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-danger)' }}>
                  {noShowTokens}
                </div>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  Total abandoned or missed customer calls
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block' }}>
                  No-Show Impact
                </span>
                <strong style={{ fontSize: '1.25rem' }}>
                  {typeof totalTokens === 'number' && totalTokens > 0
                    ? `${Math.round(((typeof noShowTokens === 'number' ? noShowTokens : 0) / totalTokens) * 100)}%`
                    : '0%'}
                </strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
