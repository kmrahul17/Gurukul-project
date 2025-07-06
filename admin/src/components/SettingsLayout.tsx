import React from 'react';
import { Outlet } from 'react-router-dom';

const SettingsLayout = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      <Outlet />
    </div>
  );
};

export default SettingsLayout;