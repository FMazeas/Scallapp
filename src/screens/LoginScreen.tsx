import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = login.trim().length > 0 && password.length > 0;

  const [bioAvailable, setBioAvailable] = useState(false);
  const [savedLogin, setSavedLogin] = useState<string | null>(null);
  const [busyBio, setBusyBio] = useState(false);

  // Vérifie le support biométrique + récupère le dernier login stocké
  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBioAvailable(compatible && enrolled);
      } catch {
        setBioAvailable(false);
      }
      const last = await SecureStore.getItemAsync('lastLogin');
      if (last) {
        setSavedLogin(last);
        // Pré-remplit si tu veux
        if (!login) setLogin(last);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishLogin = async (who: string) => {
    // Mémorise le login pour les prochaines connexions biométriques
    await SecureStore.setItemAsync('lastLogin', who);
    navigation.replace('MainTabs', { login });
  };

  // const onLogin = async () => {
  //   if (!canSubmit) return;

  //   const credentials = [
  //     { login: 'dev', password: 'dev' },
  //     { login: 'test', password: 'test' },
  //   ];

  //   const match = credentials.find(
  //     (c) => c.login === login.trim() && c.password === password
  //   );

  //   if (match) {
  //     await finishLogin(match.login);
  //   } else {
  //     Alert.alert('Échec', 'Identifiants invalides.');
  //   }
  // };

  const onLogin = async () => {
  await finishLogin(login.trim() || "guest");
};

  const onBiometricLogin = async () => {
  if (!bioAvailable) return;
  setBusyBio(true);
  try {
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: "S'authentifier",
      cancelLabel: 'Annuler',
      disableDeviceFallback: false, // autorise FaceID/TouchID avec fallback code
      fallbackLabel: 'Utiliser le code', // affiché sur iOS
    });
    if (res.success) {
      const who = savedLogin || login || 'dev';
      await finishLogin(who);
    }
  } catch (e: any) {
    Alert.alert('Biométrie', e?.message ?? 'Erreur inattendue');
  } finally {
    setBusyBio(false);
  }
};

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo_scala.png')} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Connexion</Text>

        <TextInput
          style={styles.input}
          placeholder="Identifiant"
          placeholderTextColor="#7F8387"
          autoCapitalize="none"
          value={login}
          onChangeText={setLogin}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#7F8387"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]} onPress={onLogin} disabled={!canSubmit}>
          <Text style={styles.primaryBtnText}>Se connecter</Text>
        </Pressable>

        {bioAvailable && (
          <Pressable style={[styles.secondaryBtn, busyBio && { opacity: 0.6 }]} onPress={onBiometricLogin} disabled={busyBio}>
            <Ionicons name="finger-print-outline" size={20} color="#E9EEF5" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>
              Se connecter avec l’empreinte
              {savedLogin ? ` (${savedLogin})` : ''}
            </Text>
          </Pressable>
        )}

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Pas de compte ? Inscription</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  logo: { width: 200, height: 200, marginBottom: 28 },
  title: { color: '#F2D994', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    color: '#535557',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2e68',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#1F7ADB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  secondaryBtn: {
    width: '100%',
    borderColor: '#2a2e68',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  secondaryBtnText: { color: '#E9EEF5', fontSize: 16, fontWeight: '600' },
  link: { color: '#6AE3FF', marginTop: 16, fontSize: 14 },
});
