import { View, Text, Button } from "react-native";
import { useAuth } from "../src/context/AuthContext";

export default function Home() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenido Usuario</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
