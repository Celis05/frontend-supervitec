import React, { useState, useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [transporte, setTransporte] = useState('');
  const [region, setRegion] = useState('');

  const handleRegister = async () => {
    const result = await register({ name, email, password, role, transporte, region });
    if (result.ok) {
      navigation.replace('Home');
    } else {
      alert(result.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">Crear Cuenta</Text>
      <TextInput label="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Correo" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput label="Rol" value={role} onChangeText={setRole} style={styles.input} />
      <TextInput label="Transporte" value={transporte} onChangeText={setTransporte} style={styles.input} />
      <TextInput label="Región" value={region} onChangeText={setRegion} style={styles.input} />
      <Button mode="contained" onPress={handleRegister}>Registrarse</Button>
      <Button onPress={() => navigation.navigate('Login')}>Ya tengo cuenta</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 10 }
});
