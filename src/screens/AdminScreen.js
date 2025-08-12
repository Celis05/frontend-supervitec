import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import Loader from '../components/Loader';
import MovementCard from '../components/MovementCard';
import colors from '../../constants/colors';
import { useAuth } from '../context/AuthContext';
import { getMovimientos, deleteMovimiento } from '../../utils/api';

export default function AdminScreen({ navigation }) {
  const { token } = useAuth();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovimientos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMovimientos(token);
      setMovimientos(data || []);
    } catch (error) {
      console.error('Error cargando movimientos (admin):', error);
      Alert.alert('Error', 'No se pudieron cargar los movimientos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar movimiento',
      '¿Estás seguro de que deseas eliminar este movimiento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMovimiento(id, token);
              Alert.alert('Eliminado', 'Movimiento eliminado correctamente.');
              fetchMovimientos();
            } catch (err) {
              console.error('Error al eliminar:', err);
              Alert.alert('Error', 'No se pudo eliminar el movimiento.');
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loader text="Cargando movimientos (admin)..." />;

  return (
    <View style={styles.container}>
      <Header title="Panel Admin — Movimientos" />

      <FlatList
        data={movimientos}
        keyExtractor={(item, index) => item._id?.toString() || item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <MovementCard
              movimiento={item}
              onPress={() => navigation.navigate('DetalleMovimiento', { movimiento: item })}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditMovement', { movimiento: item })}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item._id || item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateMovement')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  itemWrapper: {
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
