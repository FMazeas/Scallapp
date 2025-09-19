// components/Screen.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBackground from './AppBackground';

type Props = {
  children: React.ReactNode;
  /**
   * edges par défaut : top/left/right pour que le header “colle” au haut
   * Passe ["top", "bottom", "left", "right"] si tu veux aussi protéger le bas.
   */
  edges?: ("top" | "bottom" | "left" | "right")[];
  /**
   * padding horizontal optionnel pour uniformiser les écrans
   */
  contentPaddingHorizontal?: number;
};

export default function Screen({
  children,
  edges = ["top", "left", "right"],
  contentPaddingHorizontal,
}: Props) {
  return (
    <AppBackground>
      <SafeAreaView
        edges={edges}
        style={[
          styles.safe,
          { backgroundColor: "transparent", paddingHorizontal: contentPaddingHorizontal ?? 0 },
        ]}
      >
        {children}
      </SafeAreaView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
