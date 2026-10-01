import React from 'react';
import { RegisterForm } from '../../components/auth/RegisterForm.jsx';

export const Register = () => {
  return (
    <div>
      <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem', textAlign: 'center' }}>
        Create Account
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
        Join QueueLess to get digital tokens and track queues in real time.
      </p>
      <RegisterForm />
    </div>
  );
};

export default Register;
