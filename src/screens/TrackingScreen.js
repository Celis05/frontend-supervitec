import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Loader from '../components/Loader';
import colors from '../../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getMovimientoById } from '../../utils/api';
import Constants from 'expo-constants';

export default function TrackingScreen({ route }) {
  const { movimiento } = route.params || {};
  const initialId = movimiento?._id || movimiento?.id || '';
  const [id, setId] = useState(initialId);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Helper: llama al endpoint de tracking directamente. Se recomienda añadirlo a utils/api.js (más abajo indico cómo).
  const fetchTracking = useCallback(async (targetId) => {
    const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://192.168.1.2:3000';
    if (!targetId) {
      Alert.alert('ID requerido', 'Por favor ingresa el ID del movimiento a trackear.');
      return;
    }

    try {
      setLoading(true);
      // Intentamos el endpoint /movimientos/:id/tracking (si existe en tu backend)
      const res = await fetch(`${API_URL}/movimientos/${targetId}/tracking`, {
        headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        // Si no existe el endpoint de tracking, tratamos de obtener el movimiento normal
        const fallback = await getMovimientoById(targetId, token);
        setTracking({ fallback, message: 'No se encontró endpoint /tracking; mostrando detalle del movimiento.' });
        return;
      }

      const data = await res.json();
      setTracking(data);
    } catch (error) {
      console.error('Error cargando tracking:', error);
      Alert.alert('Error', 'No se pudo obtener el tracking del movimiento.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (initialId) {
      fetchTracking(initialId);
    }
  }, [initialId, fetchTracking]);

  return (
    <View style={styles.container}>
      <Header title="Tracking de Movimiento" />
      <View style={styles.content}>
        <Text style={styles.label}>ID Movimiento</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Ingresa ID del movimiento"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => fetchTracking(id)}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading && <Loader text="Consultando tracking..." />}

        {!loading && tracking && (
          <ScrollView style={styles.resultBox}>
            <Text style={styles.sectionTitle}>Resultado</Text>
            {/* Si backend devolvió estructura conocida, muéstrala de forma amigable.
                Como la forma exacta del tracking puede variar, aquí mostramos campos comunes y
                en último recurso el JSON crudo. */}
            {tracking.movimiento && (
              <>
                <Text style={styles.fieldTitle}>Movimiento:</Text>
                <Text style={styles.field}>{tracking.movimiento.titulo || tracking.movimiento.nombre || '—'}</Text>
              </>
            )}

            {tracking.status && (
              <>
                <Text style={styles.fieldTitle}>Estado:</Text>
                <Text style={styles.field}>{tracking.status}</Text>
              </>
            )}

            {Array.isArray(tracking.hitos) && (
              <>
                <Text style={styles.fieldTitle}>Hitos:</Text>
                {tracking.hitos.map((h, i) => (
                  <View key={i} style={styles.hit}>
                    <Text style={styles.hitText}>{h.descripcion || JSON.stringify(h)}</Text>
                    <Text style={styles.hitDate}>{h.fecha ? new Date(h.fecha).toLocaleString() : ''}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Fallback: mostrar JSON completo */}
            <Text style={[styles.fieldTitle, { marginTop: 12 }]}>JSON (raw)</Text>
            <Text style={styles.raw}>{JSON.stringify(tracking, null, 2)}</Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: 16, flex: 1 },
  label: { color: colors.dark, marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  searchBtn: {
    marginLeft: 10,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8, color: colors.primary },
  fieldTitle: { fontWeight: '700', color: colors.dark },
  field: { marginBottom: 6, color: colors.dark },
  hit: { marginVertical: 6, paddingVertical: 6, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  hitText: { color: colors.dark },
  hitDate: { color: '#777', fontSize: 12, marginTop: 4 },
  raw: { fontFamily: 'monospace', fontSize: 12, color: '#333' },
});
