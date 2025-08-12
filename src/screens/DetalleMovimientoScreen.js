import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Loader from '../components/Loader';
import colors from '../../constants/colors';
import { getMovimientoById } from '../../utils/api';

export default function DetalleMovimientoScreen({ route }) {
  const { movimientoId, movimiento: movimientoProp } = route.params || {};
  const [movimiento, setMovimiento] = useState(movimientoProp || null);
  const [loading, setLoading] = useState(!movimientoProp);

  useEffect(() => {
    if (!movimientoProp && movimientoId) {
      const fetchData = async () => {
        try {
          const data = await getMovimientoById(movimientoId);
          setMovimiento(data);
        } catch (error) {
          console.error('Error al obtener movimiento:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [movimientoId, movimientoProp]); // 🔹 Dependencia corregida

  if (loading) {
    return <Loader text="Cargando detalle..." />;
  }

  if (!movimiento) {
    return (
      <View style={styles.container}>
        <Header title="Detalle" />
        <Text style={styles.errorText}>Movimiento no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Detalle del Movimiento" />
      <ScrollView style={styles.content}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{movimiento.id}</Text>

        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{movimiento.descripcion || 'Sin descripción'}</Text>

        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{movimiento.fecha || 'Sin fecha'}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{movimiento.estado || 'Desconocido'}</Text>

        <Text style={styles.label}>Monto:</Text>
        <Text style={styles.value}>${movimiento.monto ?? 'N/A'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark, // Verde oscuro
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.error,
    fontSize: 16,
  },
});
