import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage.js';
import { authService } from '../services/authService.js';
import { ROLES } from '../constants/roles.js';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [token, setToken] = useState(storage.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = storage.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response?.data?.user) {
          setUser(response.data.user);
          storage.setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        storage.clearAuth();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const { user: loggedInUser, token: authToken } = response.data;

      storage.setToken(authToken);
      storage.setUser(loggedInUser);

      setToken(authToken);
      setUser(loggedInUser);

      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      const { user: registeredUser, token: authToken } = response.data;

      storage.setToken(authToken);
      storage.setUser(registeredUser);

      setToken(authToken);
      setUser(registeredUser);

      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === ROLES.ADMIN,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
