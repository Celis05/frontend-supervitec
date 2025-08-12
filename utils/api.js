import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://192.168.1.2:3000';

// Función para obtener el token automáticamente
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(endpoint, options = {}, requireAuth = false) {
  const authHeaders = requireAuth ? await getAuthHeaders() : {};

  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error.message);
    throw error;
  }
}

// ---- Auth ----
export async function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getProfile() {
  return apiFetch('/auth/profile', {}, true);
}

// ---- Movimientos ----
export async function getMovimientos() {
  return apiFetch('/movimientos', {}, true);
}

export async function getMovimientoById(id) {
  return apiFetch(`/movimientos/${id}`, {}, true);
}

export async function createMovimiento(payload) {
  return apiFetch('/movimientos', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export async function updateMovimiento(id, payload) {
  return apiFetch(`/movimientos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }, true);
}

export async function deleteMovimiento(id) {
  return apiFetch(`/movimientos/${id}`, {
    method: 'DELETE',
  }, true);
}

// ---- Tracking ----
export async function getTrackingById(id) {
  return apiFetch(`/movimientos/${id}/tracking`, {}, true);
}

export async function saveTracking(payload) {
  return apiFetch('/tracking', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, true);
}

export async function getTracking() {
  return apiFetch('/tracking', {}, true);
}

// ---- Historial ----
export async function getHistorial(userId) {
  return apiFetch(`/historial/${userId}`, {}, true);
}
