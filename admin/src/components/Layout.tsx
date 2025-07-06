import React from 'react';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // Add this import

export const Layout = () => { // Remove children prop since we'll use Outlet
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-gray-50">
          <Outlet /> {/* Replace children with Outlet */}
        </main>
      </div>
    </div>
  );
};

export default Layout;