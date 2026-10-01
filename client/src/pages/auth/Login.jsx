import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm.jsx';

export const Login = () => {
  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem', textAlign: 'center' }}>
        Welcome Back
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        Sign in to continue to QueueLess.
      </p>
      <LoginForm />
    </div>
  );
};

export default Login;
