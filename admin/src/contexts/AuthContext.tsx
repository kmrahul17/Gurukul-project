import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  email: string;
  role: 'admin';
  id: string;
  name: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login for development
      if (email === 'admin@gurukul.com' && password === 'admin123') {
        const adminUser = { 
          email, 
          role: 'admin' as const,
          id: '1',
          name: 'Admin User'
        };
        const mockToken = 'mock-admin-token';
        
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminToken', mockToken);
        setUser(adminUser);
        return;
      }

      // Future API integration
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { user, token } = data;

      localStorage.setItem('adminUser', JSON.stringify(user));
      localStorage.setItem('adminToken', token);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};