import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { APP_ROUTES } from '../../constants/routes.js';

export const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  const joinQueueTarget = isAuthenticated
    ? (isAdmin ? APP_ROUTES.ADMIN.DASHBOARD : APP_ROUTES.CUSTOMER.WALK_IN)
    : APP_ROUTES.PUBLIC.REGISTER;

  const bookAptTarget = isAuthenticated
    ? (isAdmin ? APP_ROUTES.ADMIN.DASHBOARD : APP_ROUTES.CUSTOMER.BOOK_APPOINTMENT)
    : APP_ROUTES.PUBLIC.LOGIN;

  const getStartedTarget = isAuthenticated
    ? (isAdmin ? APP_ROUTES.ADMIN.DASHBOARD : APP_ROUTES.CUSTOMER.DASHBOARD)
    : APP_ROUTES.PUBLIC.REGISTER;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '3.5rem 0 4rem 0' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Heading, Subtext, CTA */}
          <div>
            <span
              className="badge"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              Smart Queue Management System
            </span>
            <h1
              style={{
                fontSize: '2.75rem',
                lineHeight: 1.15,
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
              }}
            >
              Skip the Physical Queue. Stay in Control.
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              Join service queues digitally, track your position in real time, and arrive when it&apos;s almost your turn.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={joinQueueTarget} className="btn btn-primary btn-lg">
                Join the Queue
              </Link>
              <Link to={bookAptTarget} className="btn btn-outline btn-lg">
                Book an Appointment
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Representation of a Digital Queue / Token */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '380px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-main) 100%)',
                padding: '1.75rem',
              }}
            >
              {/* Token Ticket Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px dashed var(--border-color)',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Digital Queue Pass
                  </span>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
                    Customer Desk
                  </div>
                </div>
                <span className="badge badge-p1">P1 • On-Time</span>
              </div>

              {/* Token Number Display */}
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  YOUR TOKEN NUMBER
                </span>
                <div
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    lineHeight: 1.1,
                    margin: '0.25rem 0',
                    fontFamily: 'monospace',
                  }}
                >
                  A-104
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-success)' }}>
                    CHECKED-IN
                  </span>
                </div>
              </div>

              {/* Progress & Position Preview */}
              <div
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginTop: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Queue Position:</span>
                  <strong>#4 in line</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>People Ahead:</span>
                  <strong>3 customers</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Wait:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>~30 min</strong>
                </div>
              </div>

              {/* Visual Mini Queue Strip */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Live Order Dispatch:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <div style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    A-101 (Now)
                  </div>
                  <div style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    A-102
                  </div>
                  <div style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    A-103
                  </div>
                  <div style={{ padding: '0.25rem 0.5rem', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    You (A-104)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ backgroundColor: 'var(--color-secondary)', color: 'white', marginBottom: '0.75rem' }}>
            Simple 4-Step Process
          </span>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How It Works</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Experience friction-free service from any phone or computer without standing in a physical corridor.
          </p>
        </div>

        <div className="grid-4">
          {/* Step 1 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>Choose a Service</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Select the service you need.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>Get Your Digital Token</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Receive a token and QR code.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>Check In</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Scan your QR code when you arrive.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
              }}
            >
              4
            </div>
            <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>Track Your Turn</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Monitor your position and estimated waiting time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Features</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Engineered to streamline customer flow and eliminate congestion at service counters.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎫</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Digital Tokens</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Generate walk-in tokens or link to scheduled appointments without paper slips.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📲</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>QR Check-In</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Contact-free on-site check-in confirms your physical arrival at the service desk.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Live Queue Tracking</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              View live queue progress and monitor tokens ahead from your smartphone.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚖️</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Smart Priority</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Fair multi-tier scheduling: on-time appointments (P1), walk-ins (P2), and late arrivals (P3).
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⏱️</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Waiting-Time Estimate</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Accurate wait projections based on customer count and historical counter pace.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🖥️</div>
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' }}>Admin Queue Management</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Comprehensive counter orchestration, token dispatching, and status oversight.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '3.5rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About QueueLess</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-base)' }}>
            QueueLess is a modern digital queue and smart token management system built on the MERN stack.
            Designed to replace physical crowds with intelligent digital queuing, QueueLess gives customers
            peace of mind while empowering desk operators to serve visitors smoothly, fairly, and transparently.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          margin: '3rem 0',
          padding: '3.5rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready to skip the wait?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
          Create your account today and experience stress-free, digital queue management.
        </p>
        <Link to={getStartedTarget} className="btn btn-primary btn-lg">
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
