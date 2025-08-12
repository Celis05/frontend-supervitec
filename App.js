import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from "./src/context/AuthContext";

import HomeScreen from './src/screens/HomeScreen';
import HistorialScreen from './src/screens/HistorialScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import AdminScreen from './src/screens/AdminScreen';
import DetalleMovimientoScreen from './src/screens/DetalleMovimientoScreen';
import CreateMovementScreen from './src/screens/CreateMovementScreen';
import EditMovementScreen from './src/screens/EditMovementScreen';

import colors from './constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Historial') iconName = 'time';
          else if (route.name === 'Admin') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Historial" component={HistorialScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="DetalleMovimiento" component={DetalleMovimientoScreen} />
          <Stack.Screen name="CreateMovement" component={CreateMovementScreen} />
          <Stack.Screen name="EditMovement" component={EditMovementScreen} />
          <Stack screenOptions={{ headerShown: false }} />
          <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

