import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    // MOCK: accepte tout si non vide
    if (login.trim().length === 0 || password.length === 0) return;
    navigation.replace('Dashboard', { login });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        <TextInput
          style={styles.input}
          placeholder="Identifiant (email ou login)"
          placeholderTextColor="#9AA7B2"
          autoCapitalize="none"
          value={login}
          onChangeText={setLogin}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#9AA7B2"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.primaryBtn} onPress={onLogin}>
          <Text style={styles.primaryBtnText}>Se connecter</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Pas de compte ? Inscription</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0D10', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: '#E9EEF5', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { width: '100%', backgroundColor: '#13161B', color: '#E9EEF5', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1D232A' },
  primaryBtn: { width: '100%', backgroundColor: '#00B4D8', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  link: { color: '#6AE3FF', marginTop: 16, fontSize: 14 },
});