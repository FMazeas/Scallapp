import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useEffect } from 'react';
import AppBackground from './src/components/AppBackground';
import AppNavigator from './src/navigation/AppNavigator';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

export default function App() {
  useEffect(() => {
    // Barre de navigation Android
    NavigationBar.setBackgroundColorAsync('#13153b');
    NavigationBar.setButtonStyleAsync('light');
    // Optionnel: rendre la nav bar "overlay" moderne
    // NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  return (
    <AppBackground>
      {/* Barre de statut : icônes blanches, fond transparent */}
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <NavigationContainer theme={navTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AppBackground>
  );
}
