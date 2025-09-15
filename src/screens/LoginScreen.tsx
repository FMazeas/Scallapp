import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = login.trim().length > 0 && password.length > 0;

  const onLogin = () => {
    if (!canSubmit) return;
    navigation.replace('Dashboard', { login });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo_scala.png')} style={styles.logo} resizeMode='contain' />

        <Text style={styles.title}>Connexion</Text>

        <TextInput
          style={styles.input}
          placeholder='Identifiant (email ou login)'
          placeholderTextColor='#9AA7B2'
          autoCapitalize='none'
          value={login}
          onChangeText={setLogin}
        />
        <TextInput
          style={styles.input}
          placeholder='Mot de passe'
          placeholderTextColor='#9AA7B2'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]} onPress={onLogin} disabled={!canSubmit}>
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
  container: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  logo: { width: 200, height: 200, marginBottom: 28 },
  title: { color: '#E9EEF5', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { width: '100%', backgroundColor: '#1a1d47', color: '#E9EEF5', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#2a2e68' },
  primaryBtn: { width: '100%', backgroundColor: '#2f7bdc', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  link: { color: '#6AE3FF', marginTop: 16, fontSize: 14 },
});