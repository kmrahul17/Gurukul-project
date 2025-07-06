import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, Home, GraduationCap, BookMarked, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMyCourseClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/signin');
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Gurukul</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className={`text-gray-700 hover:text-blue-600 flex items-center space-x-1 ${location.pathname === '/' ? 'text-blue-600 font-medium' : ''}`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/courses" 
                className={`text-gray-700 hover:text-blue-600 flex items-center space-x-1 ${location.pathname === '/courses' ? 'text-blue-600 font-medium' : ''}`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Courses</span>
              </Link>
              <Link
                to="/my-courses"
                onClick={handleMyCourseClick}
                className={`text-gray-700 hover:text-blue-600 flex items-center space-x-1 ${location.pathname === '/my-courses' ? 'text-blue-600 font-medium' : ''}`}
              >
                <BookMarked className="h-4 w-4" />
                <span>My Courses</span>
              </Link>
              <Link 
                to="/about" 
                className={`text-gray-700 hover:text-blue-600 flex items-center space-x-1 ${location.pathname === '/about' ? 'text-blue-600 font-medium' : ''}`}
              >
                <Info className="h-4 w-4" />
                <span>About Us</span>
              </Link>
              <Link
                to="/profile"
                onClick={handleProfileClick}
                className={`text-gray-700 hover:text-blue-600 flex items-center space-x-1 ${location.pathname === '/profile' ? 'text-blue-600 font-medium' : ''}`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;