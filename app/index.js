import React, { useEffect, useContext } from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../src/context/AuthContext";

export default function Home() {
  const { user, logout, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      }
    }
  }, [loading, user, router]); // ✅ dependencias completas

  if (loading) {
    return <Text>Cargando...</Text>; // Loader provisional
  }

  return (
    <View>
      <Text>Bienvenido {user?.name || "Usuario"}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
