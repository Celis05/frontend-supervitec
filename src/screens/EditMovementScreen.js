import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Header from '../components/Header';
import colors from '../../constants/colors';
import { updateMovimiento } from '../../utils/api';

export default function EditMovementScreen({ route, navigation }) {
  const { movimiento } = route.params || {};

  const [descripcion, setDescripcion] = useState(movimiento?.descripcion || '');
  const [fecha, setFecha] = useState(movimiento?.fecha || '');
  const [estado, setEstado] = useState(movimiento?.estado || '');
  const [monto, setMonto] = useState(movimiento?.monto?.toString() || '');

  const handleUpdate = async () => {
    if (!descripcion || !fecha || !estado || !monto) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    try {
      await updateMovimiento(movimiento.id, {
        descripcion,
        fecha,
        estado,
        monto: parseFloat(monto),
      });
      Alert.alert('Éxito', 'Movimiento actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el movimiento');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Editar Movimiento" />
      <ScrollView style={styles.form}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción del movimiento"
        />

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={styles.input}
          value={estado}
          onChangeText={setEstado}
          placeholder="Estado (Ej: Pendiente, Completado)"
        />

        <Text style={styles.label}>Monto</Text>
        <TextInput
          style={styles.input}
          value={monto}
          onChangeText={setMonto}
          keyboardType="numeric"
          placeholder="Monto"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  form: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primaryDark,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: colors.primaryDark,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
