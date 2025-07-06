import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import CourseForm from './pages/CourseForm';
import SettingsLayout from './components/SettingsLayout';
import General from './pages/settings/General';
import Profile from './pages/settings/Profile';
import Security from './pages/settings/Security';
import Notifications from './pages/settings/Notifications';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Toaster position="bottom-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                {/* Dashboard */}
                <Route index element={<Dashboard />} />
                
                {/* Course Management */}
                <Route path="/courses">
                  <Route index element={<Courses />} />
                  <Route path="new" element={<CourseForm />} />
                  <Route path="edit/:id" element={<CourseForm />} />
                </Route>
                
                {/* Student Management */}
                <Route path="/students" element={<Students />} />
                
                {/* Settings */}
                <Route path="/settings" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="/settings/general" replace />} />
                  <Route path="general" element={<General />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="security" element={<Security />} />
                  <Route path="notifications" element={<Notifications />} />
                </Route>
              </Route>
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;