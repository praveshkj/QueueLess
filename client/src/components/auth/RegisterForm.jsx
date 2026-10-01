import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';
import { ErrorMessage } from '../common/ErrorMessage.jsx';
import { APP_ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

export const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ROLES.CUSTOMER,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setValidationErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    setLoading(true);
    setError('');

    // Prepare payload without confirmPassword
    const { name, email, phone, password, role } = formData;

    try {
      const user = await register({ name, email, phone, password, role });
      if (user.role === ROLES.ADMIN) {
        navigate(APP_ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(APP_ROUTES.CUSTOMER.DASHBOARD);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={error} />

      <Input
        label="Full Name"
        id="register-name"
        name="name"
        type="text"
        placeholder="e.g. Jane Doe"
        value={formData.name}
        onChange={handleChange}
        error={validationErrors.name}
        required
      />

      <Input
        label="Email"
        id="register-email"
        name="email"
        type="email"
        placeholder="e.g. jane@example.com"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        required
      />

      <Input
        label="Phone"
        id="register-phone"
        name="phone"
        type="tel"
        placeholder="e.g. +1 555-0199"
        value={formData.phone}
        onChange={handleChange}
        error={validationErrors.phone}
        required
      />

      <Input
        label="Password"
        id="register-password"
        name="password"
        type="password"
        placeholder="At least 6 characters"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        required
      />

      <Input
        label="Confirm Password"
        id="register-confirm-password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={validationErrors.confirmPassword}
        required
      />

      <div className="form-group">
        <label htmlFor="register-role" className="form-label">
          Account Role (College Demonstration)
        </label>
        <select
          id="register-role"
          name="role"
          className="form-select"
          value={formData.role}
          onChange={handleChange}
        >
          <option value={ROLES.CUSTOMER}>Customer (Standard User)</option>
          <option value={ROLES.ADMIN}>Admin (Counter Operator / Manager)</option>
        </select>
      </div>

      <Button
        id="register-submit-btn"
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        className="mt-4"
      >
        Create Account
      </Button>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to={APP_ROUTES.PUBLIC.LOGIN} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
