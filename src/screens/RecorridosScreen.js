import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuthFetch from '../hooks/useAuthFetch';

export default function RecorridosScreen() {
  const { fetchWithAuth, API_URL } = useAuthFetch();
  const [recorridos, setRecorridos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getRecorridos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_URL}/recorridos`);
      const data = await res.json();
      setRecorridos(data || []);
    } catch (error) {
      console.warn('Error cargando recorridos:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, API_URL]);

  useEffect(() => {
    getRecorridos();
  }, [getRecorridos]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!recorridos.length) {
    return (
      <View style={styles.center}>
        <Text>No hay recorridos registrados</Text>
        <Button
          title="Nuevo Recorrido"
          onPress={() => navigation.navigate('NuevoRecorrido')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recorridos}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>Distancia: {item.distancia} km</Text>
            <Text>Velocidad Promedio: {item.velocidad_promedio} km/h</Text>
            <Text>Velocidad Máxima: {item.velocidad_maxima} km/h</Text>
            <Text>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
          </View>
        )}
      />
      <Button
        title="Nuevo Recorrido"
        onPress={() => navigation.navigate('NuevoRecorrido')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
  },
});
