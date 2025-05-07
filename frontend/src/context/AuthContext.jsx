import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await axios.get('/auth/user');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};