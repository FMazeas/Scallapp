import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

//const BG = '#13153b';
const BG = '#051124' ;

export default function AppBackground({ children }: { children: React.ReactNode }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  // 👇 IMPORTANT : le return doit être AVANT la fin de la fonction
  return (
    <View style={styles.root} onLayout={onLayout}>
      <View style={StyleSheet.absoluteFill}>
        {/* Fond de base */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: BG }]} />

        {/* Léger gradient */}
        <LinearGradient
          colors={['#051124', '#d4b258']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 6}}
          style={StyleSheet.absoluteFill}
        />

        {/* Stries diagonales */}
        {/* {size.w > 0 && size.h > 0 && (
          <Svg width="100%" height="100%">
            {Array.from({ length: Math.ceil((size.w + size.h) / 32) }, (_, i) => {
              const x = -size.h + i * 32;
              return (
                <Line
                  key={i}
                  x1={x}
                  y1={0}
                  x2={x + size.h}
                  y2={size.h}
                  stroke="rgba(255,255,255,0.035)"
                  strokeWidth={1}
                />
              );
            })}
          </Svg>
        )} */}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});