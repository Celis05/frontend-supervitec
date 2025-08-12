// app/tracking/index.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import Loader from '../src/components/Loader';
import TrackingCard from '../src/components/TrackingCard';
import { apiFetch } from '../utils/api';

export default function TrackingScreen() {
  const { token } = useAuth();
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchTracking = async () => {
      try {
        const data = await apiFetch(`/tracking`, {}, token);
        setTracking(data);
      } catch (error) {
        console.error("Error cargando tracking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [token]);

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={tracking}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TrackingCard item={item} />}
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
