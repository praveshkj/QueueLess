import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';
import { ErrorMessage } from '../common/ErrorMessage.jsx';
import { APP_ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('customer'); // 'customer' or 'admin'

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setValidationErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
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

    try {
      const user = await login(formData);
      if (user.role === ROLES.ADMIN) {
        navigate(APP_ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(APP_ROUTES.CUSTOMER.DASHBOARD);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchToAdmin = () => {
    setLoginMode('admin');
    setError('');
  };

  const switchToCustomer = () => {
    setLoginMode('customer');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Role Indicator / Mode Switch */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={switchToCustomer}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: loginMode === 'customer' ? 'var(--bg-surface)' : 'transparent',
            color: loginMode === 'customer' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 'var(--font-size-xs)',
            cursor: 'pointer',
            boxShadow: loginMode === 'customer' ? 'var(--shadow-sm)' : 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          Customer Login
        </button>
        <button
          type="button"
          onClick={switchToAdmin}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: loginMode === 'admin' ? 'var(--bg-surface)' : 'transparent',
            color: loginMode === 'admin' ? 'var(--color-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: 'var(--font-size-xs)',
            cursor: 'pointer',
            boxShadow: loginMode === 'admin' ? 'var(--shadow-sm)' : 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          Admin Login
        </button>
      </div>

      <ErrorMessage message={error} />

      <Input
        label="Email"
        id="login-email"
        name="email"
        type="email"
        placeholder={loginMode === 'admin' ? 'admin@queueless.internal' : 'e.g. customer@example.com'}
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        required
      />

      <Input
        label="Password"
        id="login-password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        required
      />

      <Button
        id="login-submit-btn"
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        className="mt-4"
      >
        Login
      </Button>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        Don&apos;t have an account?{' '}
        <Link to={APP_ROUTES.PUBLIC.REGISTER} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
          Register
        </Link>
      </p>

      {loginMode === 'customer' ? (
        <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={switchToAdmin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 'var(--font-size-xs)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Switch to Admin Login
          </button>
        </div>
      ) : null}
    </form>
  );
};

export default LoginForm;
