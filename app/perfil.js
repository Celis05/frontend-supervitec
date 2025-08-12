import { View, Text } from "react-native";
import { useAuth } from "../src/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Perfil</Text>
      {user && (
        <>
          <Text>Nombre: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Rol: {user.role}</Text>
        </>
      )}
    </View>
  );
}
