import { useContext } from 'react';
import { AuthContext } from './authContext';

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
