import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ route }: Props) {
  const { login } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {login} 👋</Text>
      <Text style={styles.subtitle}>Ton espace personnel est prêt.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D10', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#E9EEF5', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#9AA7B2', fontSize: 14 },
});