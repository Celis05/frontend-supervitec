// app/login.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { useRouter } from "expo-router";
import { apiFetch } from "../utils/api";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      // Llamada al backend para autenticar
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res && res.token && res.user) {
        await login(res.user, res.token); // Guarda en contexto y AsyncStorage
        router.replace("/(tabs)"); // Redirige al home/tabs
      } else {
        Alert.alert("Error", "Credenciales inválidas");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <Button title={loading ? "Cargando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});
