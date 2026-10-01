import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar.jsx';

export const AdminLayout = () => {
  return (
    <div className="admin-layout-wrapper">
      <Sidebar />
      <div className="admin-main-area">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
