import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecorridosScreen from '../screens/RecorridosScreen';
import NuevoRecorridoScreen from '../screens/NuevoRecorridoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Aquí podrías poner un SplashScreen
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Recorridos" component={RecorridosScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegisterScreen} />
          <Stack.Screen name="NuevoRecorrido" component={NuevoRecorridoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
