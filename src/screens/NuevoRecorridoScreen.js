import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import useAuthFetch from '../hooks/useAuthFetch';

export default function NuevoRecorridoScreen({ navigation }) {
  const { fetchWithAuth } = useAuthFetch();
  const [recording, setRecording] = useState(false);
  const [locations, setLocations] = useState([]);
  const watchId = useRef(null);

  const startRecording = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso al GPS');
      return;
    }

    setLocations([]);
    setRecording(true);

    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1
      },
      (loc) => {
        setLocations((prev) => [...prev, loc]);
      }
    );
  };

  const stopRecording = async () => {
    if (watchId.current) {
      watchId.current.remove();
    }
    setRecording(false);

    if (locations.length < 2) {
      Alert.alert('Error', 'No se pudo registrar un recorrido válido');
      return;
    }

    // Cálculos básicos
    const totalDist = calcDistance(locations);
    const maxSpeed = Math.max(...locations.map(l => l.coords.speed || 0));
    const avgSpeed = totalDist / (locations.length / 3600); // km/h aprox

    // Guardar en backend
    const res = await fetchWithAuth('/recorridos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: `Recorrido ${new Date().toLocaleString()}`,
        distancia: totalDist,
        velocidadMax: maxSpeed,
        velocidadPromedio: avgSpeed,
        puntos: locations.map(l => ({
          lat: l.coords.latitude,
          lng: l.coords.longitude
        }))
      })
    });

    if (res.ok) {
      Alert.alert('Éxito', 'Recorrido guardado');
      navigation.navigate('Recorridos');
    } else {
      Alert.alert('Error', 'No se pudo guardar');
    }
  };

  const calcDistance = (locs) => {
    let dist = 0;
    for (let i = 1; i < locs.length; i++) {
      const prev = locs[i - 1].coords;
      const curr = locs[i].coords;
      dist += getDistanceFromLatLonInKm(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    }
    return dist;
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI/180);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Recorrido</Text>
      {!recording ? (
        <Button title="Iniciar Recorrido" onPress={startRecording} />
      ) : (
        <Button title="Detener Recorrido" onPress={stopRecording} color="red" />
      )}
      <Text> Puntos registrados: {locations.length} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, marginBottom: 20 }
});
