import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'authToken';

const storeSession = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootSession();
  }, []);

  const authUser = (payload) => {
    storeSession(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    authUser(data);
    return data.user;
  };

  const register = async (credentials) => {
    const { data } = await api.post('/auth/register', credentials);
    authUser(data);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    authUser(data);
    return data.user;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};