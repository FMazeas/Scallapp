import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('');    // ex: 1990-01-01
  const [netWorth, setNetWorth] = useState('');      // patrimoine
  const [notes, setNotes] = useState('');

  const onSubmit = () => {
    // MOCK: on pourrait envoyer au backend; ici on revient au Login
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Inscription</Text>

        <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#9AA7B2" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Prénom" placeholderTextColor="#9AA7B2" value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder="Date de naissance (AAAA-MM-JJ)" placeholderTextColor="#9AA7B2" value={birthDate} onChangeText={setBirthDate} />
        <TextInput style={styles.input} placeholder="Patrimoine (€)" placeholderTextColor="#9AA7B2" keyboardType="numeric" value={netWorth} onChangeText={setNetWorth} />
        <TextInput style={[styles.input, styles.textarea]} placeholder="Autres informations..." placeholderTextColor="#9AA7B2" value={notes} onChangeText={setNotes} multiline />

        <Pressable style={styles.primaryBtn} onPress={onSubmit}>
          <Text style={styles.primaryBtnText}>Créer mon compte</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Déjà un compte ? Retour connexion</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0B0D10', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: '#E9EEF5', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: { width: '100%', backgroundColor: '#13161B', color: '#E9EEF5', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1D232A' },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  primaryBtn: { width: '100%', backgroundColor: '#00B4D8', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  link: { color: '#6AE3FF', marginTop: 16, fontSize: 14 },
});
