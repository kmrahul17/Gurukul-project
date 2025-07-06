import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, // Changed icon for consistency
  GraduationCap, 
  Users, 
  Settings,
  ChevronRight,
  LayoutDashboard // Added this for Dashboard icon
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    location.pathname.startsWith('/settings')
  );

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' }, // Changed from LayoutGrid
    { label: 'Courses', icon: GraduationCap, path: '/courses' },
    { label: 'Students', icon: Users, path: '/students' },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings/general',
      submenu: [
        { label: 'General', path: '/settings/general' },
        { label: 'Profile', path: '/settings/profile' },
        { label: 'Security', path: '/settings/security' },
        { label: 'Notifications', path: '/settings/notifications' },
      ],
    },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen border-r">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold">Admin Panel</span>
        </Link>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link
              to={item.path}
              onClick={(e) => {
                if (item.submenu) {
                  e.preventDefault();
                  setIsSettingsOpen(!isSettingsOpen);
                }
              }}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                (item.submenu ? location.pathname.startsWith('/settings') : location.pathname === item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : ''
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
              {item.submenu && (
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                  isSettingsOpen ? 'rotate-90' : ''
                }`} />
              )}
            </Link>
            
            {item.submenu && isSettingsOpen && (
              <div className="bg-gray-50 border-l-2 border-blue-100 ml-4">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`flex items-center px-8 py-2 text-sm ${
                      location.pathname === subItem.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;