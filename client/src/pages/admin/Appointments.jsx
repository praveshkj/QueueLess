import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { serviceService } from '../../services/serviceService.js';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { Loader } from '../../components/common/Loader.jsx';

export const Appointments = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceService.getAllServices();
        if (res?.data?.services) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.warn('Could not fetch services for filter:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <Loader message="Loading appointment console..." />;
  }

  return (
    <div>
      <AdminHeader
        title="Admin Appointments"
        subtitle="Review scheduled customer visits and monitor slot reservations"
      />

      <div className="admin-content">
        {/* Filters */}
        <div className="card mb-6">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="filter-apt-service" className="form-label">
                Filter by Service
              </label>
              <select
                id="filter-apt-service"
                className="form-select"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="ALL">All Services</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="filter-apt-status" className="form-label">
                Filter by Status
              </label>
              <select
                id="filter-apt-status"
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="CHECKED_IN">CHECKED_IN</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table / UI */}
        <div className="card">
          <div className="flex-between mb-4">
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Scheduled Appointments</h3>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
              }}
            >
              API Status: Admin Global Aggregator Pending (Phase 2)
            </span>
          </div>

          <div className="data-table-container mb-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Appointment Time</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📅</span>
                      <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                        Global Admin Appointments Roster
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Customer-side appointment booking and priority check-in (P1) are fully functional via <code>/customer/appointments</code>.
                        The backend multi-user admin aggregation endpoint (<code>GET /api/v1/appointments</code>) is pending server implementation.
                      </p>
                      <span className="badge badge-waiting">Awaiting Server Route GET /api/v1/appointments</span>
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

export default Appointments;
