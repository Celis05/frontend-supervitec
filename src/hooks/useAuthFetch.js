import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAuthFetch() {
  const API_URL = 'http://192.168.1.2:3000'; // <- cambia esto por tu backend

  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      return res;
    } catch (error) {
      console.error('Error en fetchWithAuth:', error);
      throw error;
    }
  }, [API_URL]);

  return { fetchWithAuth, API_URL };
}
