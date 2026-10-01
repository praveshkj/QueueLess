import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { serviceService } from '../../services/serviceService.js';
import { tokenService } from '../../services/tokenService.js';
import { queueService } from '../../services/queueService.js';
import { Button } from '../../components/common/Button.jsx';
import { Loader } from '../../components/common/Loader.jsx';
import { ErrorMessage } from '../../components/common/ErrorMessage.jsx';
import { APP_ROUTES } from '../../constants/routes.js';

export const WalkInToken = () => {
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(
    location.state?.selectedServiceId || ''
  );
  const [summary, setSummary] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [loadingServices, setLoadingServices] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await serviceService.getAllServices();
        if (response?.data?.services) {
          const activeServices = response.data.services.filter((s) => s.isActive);
          setServices(activeServices);
          if (!selectedServiceId && activeServices.length > 0) {
            setSelectedServiceId(activeServices[0]._id);
          }
        }
      } catch (err) {
        setError('Failed to fetch services: ' + err.message);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
  }, [selectedServiceId]);

  useEffect(() => {
    const loadSummary = async () => {
      if (!selectedServiceId) {
        setSummary(null);
        return;
      }
      try {
        const res = await queueService.getQueueSummary(selectedServiceId);
        if (res?.data) {
          setSummary(res.data);
        }
      } catch {
        setSummary(null);
      }
    };
    loadSummary();
  }, [selectedServiceId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) {
      setError('Please select a service desk');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await tokenService.createWalkInToken(selectedServiceId);
      if (response?.data?.token) {
        setGeneratedToken(response.data.token);
      } else {
        throw new Error('Token creation returned an empty response');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate walk-in token');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingServices) {
    return <Loader message="Loading queue services..." />;
  }

  const selectedService = services.find((s) => s._id === selectedServiceId);

  // VIEW AFTER SUCCESSFUL TOKEN GENERATION
  if (generatedToken) {
    return (
      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-completed" style={{ marginBottom: '0.75rem' }}>
            Success
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Your Token</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your digital walk-in queue pass has been generated.
          </p>
        </div>

        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '2.5rem 2rem',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            OFFICIAL DIGITAL TOKEN
          </span>

          <div
            style={{
              fontSize: '4rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              fontFamily: 'monospace',
              lineHeight: 1.1,
              margin: '0.75rem 0',
            }}
          >
            {generatedToken.tokenNumber}
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {generatedToken.serviceId?.serviceName || selectedService?.serviceName || 'General Desk'}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className="badge badge-p2">Priority: P2 — Walk-In</span>
            <span className={`badge badge-${generatedToken.status.toLowerCase()}`}>
              {generatedToken.status}
            </span>
          </div>

          {/* QR Code Placeholder */}
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              maxWidth: '220px',
              margin: '0 auto 1.5rem auto',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>📱</div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
              QR Code Scanner Placeholder
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              (QR check-in coming in next phase)
            </span>
          </div>

          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Keep this screen open or view your active status anytime under <strong>My Tokens</strong> or <strong>Live Queue</strong>.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/customer/tokens/${generatedToken._id}`} className="btn btn-primary btn-sm">
              Token Details
            </Link>
            <Link to={APP_ROUTES.CUSTOMER.QUEUE} className="btn btn-outline btn-sm">
              View Live Queue
            </Link>
            <Link to={APP_ROUTES.CUSTOMER.DASHBOARD} className="btn btn-outline btn-sm">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // GENERATION FLOW
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Join Walk-In Queue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Follow the 4 steps below to generate an instant digital token.
        </p>
      </div>

      <div className="card">
        <ErrorMessage message={error} />

        <form onSubmit={handleGenerate}>
          {/* STEP 1: Select Service */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                1
              </span>
              <label htmlFor="walkin-service" className="form-label" style={{ margin: 0 }}>
                Select Service
              </label>
            </div>

            <select
              id="walkin-service"
              className="form-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
            >
              <option value="">-- Choose a Service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.serviceName} (~{s.avgServiceTime} mins avg)
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: Review Estimated Waiting Time */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                2
              </span>
              <span className="form-label" style={{ margin: 0 }}>
                Review Estimated Waiting Time
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Customers Waiting Ahead:</span>
                <strong>{summary ? `${summary.waitingCount || 0} customers` : '--'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Wait Time:</span>
                <strong style={{ color: 'var(--color-primary)' }}>
                  {summary ? `~${summary.estimatedMinutes || 0} min` : (selectedService ? `~${selectedService.avgServiceTime} min` : '--')}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Priority Level:</span>
                <span className="badge badge-p2">P2 — Walk-In</span>
              </div>
            </div>
          </div>

          {/* STEP 3: Confirm */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                3
              </span>
              <span className="form-label" style={{ margin: 0 }}>
                Confirm Queue Entry
              </span>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                required
              />
              <span>I confirm I am present or heading to the service counter.</span>
            </label>
          </div>

          {/* STEP 4: Generate Token */}
          <Button
            id="generate-token-btn"
            type="submit"
            variant="primary"
            fullWidth
            loading={generating}
            disabled={!selectedServiceId || !confirmed}
          >
            Get Digital Token
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WalkInToken;
