import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Loader from '../components/Loader';
import HistorialCard from '../components/HistorialCard';
import colors from '../../constants/colors';
import { getMovimientos } from '../../utils/api';
import { useAuth } from '../context/AuthContext';

export default function HistorialScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovimientos(token);
        setMovimientos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener historial:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return <Loader text="Cargando historial..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Historial" />
      <FlatList
        data={movimientos}
        keyExtractor={(item, index) => item._id?.toString() || item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <HistorialCard
            movimiento={item}
            onPress={() => navigation.navigate('TrackingScreen', { movimiento: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
});
