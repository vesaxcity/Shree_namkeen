import { useState } from 'react';
import { AuthContext } from './authContext';

const readStoredUser = () => {
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');

  if (!token || !userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    return null;
  }
};

/**
 * AuthProvider — Mock authentication provider.
 *
 * Stores user data and a mock token in localStorage so sessions
 * survive page refreshes. All auth methods (login, register, logout)
 * are mock implementations — replace them with real API calls in Phase 3.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  /**
   * Mock login — accepts any email/password and creates a customer user.
   * TODO: Replace with POST /api/auth/login in Phase 3.
   */
  const login = async (email, password) => {
    void password;

    const mockUser = {
      id: 1,
      name: 'Test User',
      email,
      role: 'customer',
    };

    setUser(mockUser);
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('userData', JSON.stringify(mockUser));
    return mockUser;
  };

  /**
   * Mock register — creates a new user from the supplied data.
   * TODO: Replace with POST /api/auth/register in Phase 3.
   */
  const register = async (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'customer',
    };

    setUser(newUser);
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('userData', JSON.stringify(newUser));
    return newUser;
  };

  /** Clears auth state and localStorage tokens. */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    loading: false,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
