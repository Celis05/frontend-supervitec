import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register as apiRegister, getProfile } from '../../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y token desde almacenamiento local
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading auth from storage', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password); // { token, user }
      setUser(data.user);
      setToken(data.token);

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Error en login:', error.message);
      throw error;
    }
  };

  // Registro
  const register = async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password); // { token, user }
      setUser(data.user);
      setToken(data.token);

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Error en registro:', error.message);
      throw error;
    }
  };

  // Obtener perfil (usando token de AsyncStorage)
  const fetchProfile = async () => {
    try {
      const profileData = await getProfile();
      setUser(profileData);
      await AsyncStorage.setItem('user', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error obteniendo perfil:', error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error clearing auth data', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        fetchProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}
