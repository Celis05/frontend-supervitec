import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TrackingCard({ tracking }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{tracking.estado}</Text>
      <Text style={styles.subtitle}>Fecha: {new Date(tracking.fecha).toLocaleString()}</Text>
      {tracking.ubicacion && (
        <Text style={styles.location}>Ubicación: {tracking.ubicacion}</Text>
      )}
      {tracking.comentario && (
        <Text style={styles.comment}>Comentario: {tracking.comentario}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
