import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

export default function HistorialCard({ movimiento, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title}>{movimiento?.titulo || 'Movimiento'}</Text>
        <Text style={styles.date}>
          {movimiento?.fecha
            ? new Date(movimiento.fecha).toLocaleDateString()
            : 'Sin fecha'}
        </Text>
      </View>
      <Text style={styles.description}>
        {movimiento?.descripcion || 'Sin descripción'}
      </Text>
      <Text style={styles.amount}>
        {movimiento?.monto ? `$ ${movimiento.monto}` : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  date: {
    fontSize: 14,
    color: colors.dark,
  },
  description: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
