// src/screens/RegisterScreen.tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const canSubmit =
    login.trim().length > 0 &&
    password.length >= 4 &&
    confirm.length > 0 &&
    password === confirm;

  const onRegister = () => {
    if (!canSubmit) {
      Alert.alert("Formulaire incomplet", "Vérifie les champs saisis.");
      return;
    }

    // Démo : on ne crée pas vraiment de compte.
    // Tu pourras brancher ça sur ton API ensuite.
    Alert.alert("Compte créé", "Tu peux maintenant te connecter.", [
      { text: "OK", onPress: () => navigation.navigate("Login") },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        <TextInput
          style={styles.input}
          placeholder="Identifiant"
          placeholderTextColor="#9AA7B2"
          autoCapitalize="none"
          value={login}
          onChangeText={setLogin}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe (min 4)"
          placeholderTextColor="#9AA7B2"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          placeholderTextColor="#9AA7B2"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Pressable
          style={[styles.primaryBtn, !canSubmit && { opacity: 0.6 }]}
          onPress={onRegister}
          disabled={!canSubmit}
        >
          <Text style={styles.primaryBtnText}>Créer mon compte</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  title: { color: "#E9EEF5", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  input: {
    width: "100%",
    backgroundColor: "#1a1d47",
    color: "#E9EEF5",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2e68",
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#2f7bdc",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
  link: { color: "#6AE3FF", marginTop: 16, fontSize: 14 },
});
