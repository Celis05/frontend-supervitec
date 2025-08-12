import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';

export default function MovementCard({ movimiento, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title}>{movimiento?.titulo || 'Movimiento'}</Text>
        <Text style={styles.amount}>
          {movimiento?.monto ? `$ ${movimiento.monto}` : ''}
        </Text>
      </View>
      <Text style={styles.description}>
        {movimiento?.descripcion || 'Sin descripción'}
      </Text>
      <Text style={styles.date}>
        {movimiento?.fecha
          ? new Date(movimiento.fecha).toLocaleDateString()
          : ''}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: colors.dark,
  },
});
