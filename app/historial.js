// app/historial/index.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import Loader from '../src/components/Loader';
import HistorialCard from '../src/components/HistorialCard';
import { apiFetch } from '../utils/api';

export default function HistorialScreen() {
  const { user, token } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    const fetchHistorial = async () => {
      try {
        const data = await apiFetch(`/tracking/user/${user.id}`, {}, token);
        setHistorial(data);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [user, token]);

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HistorialCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
});
