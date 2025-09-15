// src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: { login: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        contentStyle: { backgroundColor: 'transparent' },
        headerStyle: { backgroundColor: 'transparent' },
        headerShadowVisible: false,
        /** header en blanc (titre + flèche de retour) */
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },

        /** (Point 2) éviter les “fantômes” lors des transitions */
        animation: 'none',          // changement instantané, pas de chevauchement
        // unmountOnBlur: true,     // optionnel: démonte l’écran quand on le quitte
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Inscription' }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Espace personnel' }} />
    </Stack.Navigator>
  );
}