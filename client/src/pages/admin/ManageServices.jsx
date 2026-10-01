import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader.jsx';
import { serviceService } from '../../services/serviceService.js';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    avgServiceTime: 15,
    isActive: true,
  });

  const loadServices = async () => {
    try {
      const response = await serviceService.getAllServices(true);
      if (response?.data?.services) {
        setServices(response.data.services);
      }
    } catch (err) {
      setError('Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingServiceId(null);
    setFormData({
      serviceName: '',
      description: '',
      avgServiceTime: 15,
      isActive: true,
    });
    setIsModalOpen(true);
    setError('');
  };

  const openEditModal = (service) => {
    setEditingServiceId(service._id);
    setFormData({
      serviceName: service.serviceName,
      description: service.description || '',
      avgServiceTime: service.avgServiceTime || 15,
      isActive: Boolean(service.isActive),
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingServiceId) {
        await serviceService.updateService(editingServiceId, formData);
      } else {
        await serviceService.createService(formData);
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleToggleDeactivate = async (service) => {
    setError('');
    try {
      await serviceService.updateService(service._id, { isActive: !service.isActive });
      loadServices();
    } catch (err) {
      setError(err.message || 'Failed to update service status');
    }
  };

  if (loading) {
    return <Loader message="Loading service desks..." />;
  }

  return (
    <div>
      <AdminHeader
        title="Manage Services"
        subtitle="Configure service desks, target processing velocities, and active status"
      />

      <div className="admin-content">
        <div className="flex-between mb-4">
          <h2 style={{ fontSize: '1.25rem' }}>Services List</h2>
          <Button variant="primary" size="sm" onClick={openAddModal}>
            + Add Service
          </Button>
        </div>

        <ErrorMessage message={error} />

        {services.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Average Service Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.serviceName}</strong>
                      {s.description && (
                        <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                          {s.description}
                        </span>
                      )}
                    </td>
                    <td>~{s.avgServiceTime} min</td>
                    <td>
                      <span className={`badge ${s.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(s)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={s.isActive ? 'danger' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleDeactivate(s)}
                        >
                          {s.isActive ? 'Deactivate' : 'Activate'}
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
            icon="🏥"
            title="No services found"
            description="Get started by creating your first departmental service desk."
            actionText="Add Service"
            onAction={openAddModal}
          />
        )}

        {/* Add / Edit Service Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingServiceId ? 'Edit Service' : 'Add Service'}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Service Name"
              id="service-name-input"
              value={formData.serviceName}
              onChange={(e) => setFormData((p) => ({ ...p, serviceName: e.target.value }))}
              placeholder="e.g. Account Services"
              required
            />

            <Input
              label="Description"
              id="service-desc-input"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of the service"
            />

            <Input
              label="Average Service Time (minutes)"
              id="service-time-input"
              type="number"
              value={formData.avgServiceTime}
              onChange={(e) => setFormData((p) => ({ ...p, avgServiceTime: parseInt(e.target.value, 10) || 1 }))}
              min="1"
              required
            />

            <div className="form-group">
              <label htmlFor="service-status-select" className="form-label">
                Operational Status
              </label>
              <select
                id="service-status-select"
                className="form-select"
                value={formData.isActive ? 'true' : 'false'}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.value === 'true' }))}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {editingServiceId ? 'Save Changes' : 'Create Service'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageServices;
