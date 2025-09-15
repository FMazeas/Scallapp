// src/screens/RegisterScreen.tsx
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [netWorth, setNetWorth] = useState('');
  const [notes, setNotes] = useState('');

  // borne : pas de date future, et on peut imposer 18 ans minimum si tu veux
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    // Sur Android, "dismissed" si l'utilisateur annule
    if (event.type === 'set' && date) {
      setBirthDate(date);
    }
    if (Platform.OS === 'android') setShowPicker(false);
  };

  const onSubmit = () => {
    // MOCK: ici on retournerait au Login (en vrai, on appellerait une API)
    navigation.navigate('Login');
  };

  const birthDateLabel =
    birthDate ? birthDate.toLocaleDateString() : 'Date de naissance (taper pour choisir)';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Inscription</Text>

        <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#9AA7B2" value={lastName} onChangeText={setLastName} />
        <TextInput style={styles.input} placeholder="Prénom" placeholderTextColor="#9AA7B2" value={firstName} onChangeText={setFirstName} />

        {/* Champ "affiché" + ouverture du picker */}
        <Pressable style={[styles.input, styles.dateField]} onPress={() => setShowPicker(true)}>
          <Text style={[styles.dateText, !birthDate && { color: '#9AA7B2' }]}>{birthDateLabel}</Text>
        </Pressable>

        {/* iOS: le picker peut rester inline; Android: modal qui s’ouvre/ferme */}
        {showPicker && (
          <DateTimePicker
            value={birthDate ?? eighteenYearsAgo}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            maximumDate={today}                // pas de dates futures
            // minimumDate={new Date(1900, 0, 1)} // optionnel: limite basse
            onChange={onChange}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Patrimoine (€)"
          placeholderTextColor="#9AA7B2"
          keyboardType="numeric"
          value={netWorth}
          onChangeText={setNetWorth}
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Autres informations..."
          placeholderTextColor="#9AA7B2"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

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
  container: { flexGrow: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { color: '#E9EEF5', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  input: {
    width: '100%',
    backgroundColor: '#1a1d47',
    color: '#E9EEF5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2e68',
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  primaryBtn: { width: '100%', backgroundColor: '#00B4D8', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  link: { color: '#6AE3FF', marginTop: 16, fontSize: 14 },
  dateField: { justifyContent: 'center' },
  dateText: { color: '#E9EEF5', fontSize: 16 },
});
