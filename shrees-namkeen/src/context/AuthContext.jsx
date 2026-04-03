import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * useAuth — Access the global authentication context.
 * Must be used within an <AuthProvider>.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AuthProvider — Mock authentication provider.
 *
 * Stores user data and a mock token in localStorage so sessions
 * survive page refreshes. All auth methods (login, register, logout)
 * are mock implementations — replace them with real API calls in Phase 3.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: rehydrate from localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Mock login — accepts any email/password and creates a customer user.
   * TODO: Replace with POST /api/auth/login in Phase 3.
   */
  const login = async (email, password) => {
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
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
