import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import authService from '../src/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Session on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if token exists
        if (authService.isAuthenticated()) {
          // Try to get current user from API
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } else {
          // Check localStorage for cached user
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear invalid session
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  /**
   * Register new user
   */
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  /**
   * Login with Google (TODO: Implement OAuth)
   */
  const loginWithGoogle = async (): Promise<boolean> => {
    // TODO: Implement Google OAuth integration
    console.warn('Google login not yet implemented');
    return false;
  };

  /**
   * Logout
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
