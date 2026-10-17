import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientRingProps {
  size: number;
  strokeWidth?: number;
  gradientColors: [string, string, ...string[]];
  backgroundColor?: string;
  children: React.ReactNode;
}

export const GradientRing: React.FC<GradientRingProps> = ({
  size,
  strokeWidth = 2.5,
  gradientColors,
  backgroundColor = '#FFFFFF',
  children,
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.outerRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          padding: strokeWidth,
        },
      ]}
    >
      <View
        style={[
          styles.innerRing,
          {
            borderRadius: (size - strokeWidth * 2) / 2,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
});
