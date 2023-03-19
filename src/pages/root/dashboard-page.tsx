import React, { ReactElement } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { Outlet } from 'react-router';
const DashboardPage = (): ReactElement => {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default DashboardPage;
