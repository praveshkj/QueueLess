import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { CustomerLayout } from '../layouts/CustomerLayout.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RoleRoute } from './RoleRoute.jsx';

// Public Pages
import { Home } from '../pages/public/Home.jsx';
import { NotFound } from '../pages/public/NotFound.jsx';
import { Unauthorized } from '../pages/public/Unauthorized.jsx';

// Auth Pages
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard.jsx';
import { Services } from '../pages/customer/Services.jsx';
import { BookAppointment } from '../pages/customer/BookAppointment.jsx';
import { WalkInToken } from '../pages/customer/WalkInToken.jsx';
import { MyTokens } from '../pages/customer/MyTokens.jsx';
import { TokenDetails } from '../pages/customer/TokenDetails.jsx';
import { QueueStatus } from '../pages/customer/QueueStatus.jsx';
import { Profile } from '../pages/customer/Profile.jsx';
import { MyAppointments } from '../pages/customer/MyAppointments.jsx';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard.jsx';
import { ManageServices } from '../pages/admin/ManageServices.jsx';
import { ManageCounters } from '../pages/admin/ManageCounters.jsx';
import { LiveQueue } from '../pages/admin/LiveQueue.jsx';
import { TokenManagement } from '../pages/admin/TokenManagement.jsx';
import { Appointments } from '../pages/admin/Appointments.jsx';
import { Analytics } from '../pages/admin/Analytics.jsx';

// Constants
import { APP_ROUTES } from '../constants/routes.js';
import { ROLES } from '../constants/roles.js';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path={APP_ROUTES.PUBLIC.HOME} element={<Home />} />
        <Route path={APP_ROUTES.PUBLIC.UNAUTHORIZED} element={<Unauthorized />} />
      </Route>

      {/* Authentication Pages */}
      <Route element={<AuthLayout />}>
        <Route path={APP_ROUTES.PUBLIC.LOGIN} element={<Login />} />
        <Route path={APP_ROUTES.PUBLIC.REGISTER} element={<Register />} />
      </Route>

      {/* Customer Protected Pages */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={APP_ROUTES.CUSTOMER.DASHBOARD} replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="appointments/book" element={<BookAppointment />} />
        <Route path="tokens" element={<MyTokens />} />
        <Route path="tokens/walk-in" element={<WalkInToken />} />
        <Route path="tokens/:id" element={<TokenDetails />} />
        <Route path="queue" element={<QueueStatus />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Protected Pages (Admin Role Required) */}
      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to={APP_ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="counters" element={<ManageCounters />} />
        <Route path="queue" element={<LiveQueue />} />
        <Route path="tokens" element={<TokenManagement />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* 404 Catch All */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
