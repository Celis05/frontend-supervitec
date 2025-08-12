import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Loader from '../components/Loader';
import MovementCard from '../components/MovementCard';
import colors from '../../constants/colors';
import { getMovimientos } from '../../utils/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovimientos();
        setMovimientos(data || []);
      } catch (error) {
        console.error('Error al obtener movimientos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader text="Cargando movimientos..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Movimientos" />
      <FlatList
        data={movimientos}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <MovementCard
            movimiento={item}
            onPress={() => navigation.navigate('Detalle', { movimiento: item })}
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
