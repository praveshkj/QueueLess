import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { counterService } from '../../services/counterService.js';
import { serviceService } from '../../services/serviceService.js';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { APP_ROUTES } from '../../constants/routes.js';

export const ManageCounters = () => {
  const [counters, setCounters] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingCounters, setLoadingCounters] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounterId, setEditingCounterId] = useState(null);
  const [formData, setFormData] = useState({
    counterName: '',
    assignedServiceId: '',
    isOpen: true,
  });

  // Load existing services from existing service API
  const loadServices = async () => {
    setLoadingServices(true);
    setServiceError('');
    try {
      const response = await serviceService.getAllServices();
      if (response?.data?.services) {
        setServices(response.data.services);
      } else {
        setServices([]);
      }
    } catch (err) {
      setServiceError(err.message || 'Failed to load services list');
    } finally {
      setLoadingServices(false);
    }
  };

  // Load counters
  const loadCounters = async () => {
    setLoadingCounters(true);
    try {
      const response = await counterService.getAllCounters();
      if (response?.data?.counters) {
        setCounters(response.data.counters);
      } else {
        setCounters([]);
      }
    } catch (err) {
      setError('Failed to load counters: ' + err.message);
    } finally {
      setLoadingCounters(false);
    }
  };

  useEffect(() => {
    loadCounters();
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingCounterId(null);
    setFormData({
      counterName: '',
      assignedServiceId: services.length > 0 ? services[0]._id : '',
      isOpen: true,
    });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (counter) => {
    setEditingCounterId(counter._id);
    // Resolve service id from populated object or ID string
    const existingServiceId =
      counter.serviceId?._id ||
      counter.serviceId ||
      counter.assignedServiceId?._id ||
      counter.assignedServiceId ||
      (services.length > 0 ? services[0]._id : '');

    setFormData({
      counterName: counter.counterName || '',
      assignedServiceId: existingServiceId,
      isOpen: Boolean(counter.isOpen),
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.counterName.trim()) {
      setError('Counter Name is required');
      return;
    }

    if (!formData.assignedServiceId) {
      setError('Please select an assigned service');
      return;
    }

    try {
      if (editingCounterId) {
        await counterService.updateCounter(editingCounterId, {
          counterName: formData.counterName.trim(),
          assignedServiceId: formData.assignedServiceId,
          serviceId: formData.assignedServiceId,
          isOpen: formData.isOpen,
        });
      } else {
        await counterService.createCounter({
          counterName: formData.counterName.trim(),
          assignedServiceId: formData.assignedServiceId,
          serviceId: formData.assignedServiceId,
          isOpen: formData.isOpen,
        });
      }
      setIsModalOpen(false);
      loadCounters();
    } catch (err) {
      setError(err.message || 'Failed to save counter');
    }
  };

  const handleToggleOpenClose = async (counter, targetIsOpen) => {
    setError('');
    try {
      await counterService.updateCounter(counter._id, { isOpen: targetIsOpen });
      loadCounters();
    } catch (err) {
      setError(err.message || 'Failed to update counter state');
    }
  };

  // Helper to format assigned service name
  const getServiceName = (counter) => {
    if (counter.serviceId?.serviceName) {
      return counter.serviceId.serviceName;
    }
    if (counter.assignedServiceId?.serviceName) {
      return counter.assignedServiceId.serviceName;
    }
    const matchId = counter.serviceId?._id || counter.serviceId || counter.assignedServiceId;
    const found = services.find((s) => s._id === matchId);
    return found ? found.serviceName : 'General Desk';
  };

  if (loadingCounters && counters.length === 0) {
    return <Loader message="Loading service counters..." />;
  }

  return (
    <div>
      <AdminHeader
        title="Manage Counters"
        subtitle="Manage physical counter stations, desk assignments, and open/closed states"
      />

      <div className="admin-content">
        <div className="flex-between mb-4">
          <h2 style={{ fontSize: '1.25rem' }}>Counter Stations ({counters.length})</h2>
          <Button variant="primary" size="sm" onClick={openAddModal}>
            + Add Counter
          </Button>
        </div>

        <ErrorMessage message={error} />

        {counters.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Counter Name</th>
                  <th>Assigned Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.counterName}</strong>
                    </td>
                    <td>{getServiceName(c)}</td>
                    <td>
                      <span className={`badge ${c.isOpen ? 'badge-completed' : 'badge-cancelled'}`}>
                        {c.isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(c)}
                        >
                          Edit
                        </Button>
                        {c.isOpen ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleToggleOpenClose(c, false)}
                          >
                            Close
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleToggleOpenClose(c, true)}
                          >
                            Open
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="🖥️"
            title="No counters configured"
            description="Add your first counter window or service desk to start processing queue tokens."
            actionText="Add Counter"
            onAction={openAddModal}
          />
        )}

        {/* Create / Edit Counter Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCounterId ? 'Edit Counter' : 'Add Counter'}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Counter Name"
              id="cnt-name-input"
              value={formData.counterName}
              onChange={(e) => setFormData((p) => ({ ...p, counterName: e.target.value }))}
              placeholder="e.g. Counter 01, Desk A"
              required
            />

            {/* Assigned Service Dropdown with Loading, Empty, and Error States */}
            <div className="form-group">
              <label htmlFor="cnt-service-select" className="form-label">
                Assigned Service
              </label>

              {loadingServices ? (
                <div style={{ padding: '0.625rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                  Loading services...
                </div>
              ) : serviceError ? (
                <div>
                  <div className="alert alert-error" style={{ marginBottom: '0.5rem' }}>
                    {serviceError}
                  </div>
                  <Button variant="outline" size="sm" type="button" onClick={loadServices}>
                    Retry loading services
                  </Button>
                </div>
              ) : services.length === 0 ? (
                <div
                  style={{
                    backgroundColor: 'var(--color-warning-light)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fed7aa',
                    color: '#9a3412',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600 }}>
                    ⚠️ No services exist yet.
                  </p>
                  <p style={{ margin: '0 0 1rem 0', fontSize: 'var(--font-size-xs)' }}>
                    Please create a service in Manage Services first before adding a counter.
                  </p>
                  <Link
                    to={APP_ROUTES.ADMIN.SERVICES}
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Go to Manage Services →
                  </Link>
                </div>
              ) : (
                <select
                  id="cnt-service-select"
                  className="form-select"
                  value={formData.assignedServiceId}
                  onChange={(e) => setFormData((p) => ({ ...p, assignedServiceId: e.target.value }))}
                  required
                >
                  <option value="">-- Choose an Assigned Service --</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.serviceName} (~{s.avgServiceTime}m avg)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {editingCounterId && (
              <div className="form-group">
                <label htmlFor="cnt-status-select" className="form-label">
                  Desk Status
                </label>
                <select
                  id="cnt-status-select"
                  className="form-select"
                  value={formData.isOpen ? 'true' : 'false'}
                  onChange={(e) => setFormData((p) => ({ ...p, isOpen: e.target.value === 'true' }))}
                >
                  <option value="true">Open</option>
                  <option value="false">Closed</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!loadingServices && services.length === 0}
              >
                {editingCounterId ? 'Save Changes' : 'Create Counter'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCounters;
