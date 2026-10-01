import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { APP_ROUTES } from '../../constants/routes.js';
import { TOKEN_STATUS } from '../../constants/tokenStatus.js';

export const TokenManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  return (
    <div>
      <AdminHeader
        title="Admin Tokens"
        subtitle="Search, audit, and inspect issued digital queue passes across all counters"
      />

      <div className="admin-content">
        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <input
              type="text"
              className="form-input"
              style={{ maxWidth: '320px' }}
              placeholder="Search by token number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>
                Status:
              </span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: 'var(--font-size-xs)' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                {Object.keys(TOKEN_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Token Management Table */}
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Token Registry</h3>
            <span className="badge" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              API Status: Admin Global Token List Pending (Phase 2)
            </span>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Check-In</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🎫</span>
                      <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                        Global Admin Token Registry
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Tokens are actively generated and managed in real-time on the{' '}
                        <Link to={APP_ROUTES.ADMIN.QUEUE} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                          Live Queue Orchestrator
                        </Link>. Full database-wide search across historical tokens (<code>GET /api/v1/tokens</code>) is slated for the upcoming backend phase.
                      </p>
                      <Link to={APP_ROUTES.ADMIN.QUEUE} className="btn btn-primary btn-sm">
                        Go to Live Queue
                      </Link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenManagement;
