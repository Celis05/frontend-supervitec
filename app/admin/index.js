import { View, Text, Button } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function AdminPanel() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Panel de Administración</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
