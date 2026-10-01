import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { userService } from '../../services/userService.js';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';

export const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Name and Phone number are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your personal details and account settings.
        </p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      <ErrorMessage message={error} />

      {/* SECTION 1: Personal Information */}
      <div className="card mb-6">
        <div className="flex-between mb-4">
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Personal Information</h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(true);
                setSuccess('');
                setError('');
              }}
            >
              ✏️ Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              id="profile-name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />

            <Input
              label="Phone Number"
              id="profile-phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              required
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" loading={loading}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user?.name || '', phone: user?.phone || '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Full Name:</span>
              <strong style={{ fontSize: 'var(--font-size-sm)' }}>{user?.name || '--'}</strong>
            </div>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Phone Number:</span>
              <strong style={{ fontSize: 'var(--font-size-sm)' }}>{user?.phone || '--'}</strong>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Account Information */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Account Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Email Address:</span>
            <strong style={{ fontSize: 'var(--font-size-sm)' }}>{user?.email || '--'}</strong>
          </div>
          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>Account Role:</span>
            <span className="badge badge-p1">{user?.role || 'CUSTOMER'}</span>
          </div>
          <div className="flex-between">
            <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>User ID:</span>
            <code style={{ fontSize: 'var(--font-size-xs)', backgroundColor: 'var(--bg-subtle)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
              {user?._id || user?.id || '--'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
