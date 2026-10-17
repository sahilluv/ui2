import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ExploreMediaCard } from '../types';
import { ThemeColors } from '../theme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 36 - 12) / 2;

interface MediaGridProps {
  cards: ExploreMediaCard[];
  colors: ThemeColors;
  onCardPress?: (card: ExploreMediaCard) => void;
  isAsymmetric?: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  cards,
  colors,
  onCardPress,
  isAsymmetric = true,
}) => {
  // Split into left and right columns for authentic asymmetric layout
  const leftColumn = cards.filter((_, i) => i % 2 === 0);
  const rightColumn = cards.filter((_, i) => i % 2 !== 0);

  return (
    <View style={styles.container}>
      {/* Left Column */}
      <View style={styles.column}>
        {leftColumn.map((card, index) => {
          const cardHeight = isAsymmetric
            ? index === 0 ? 210 : 160
            : 165;

          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.cardWrapper,
                { height: cardHeight, borderColor: colors.cardBorder },
              ]}
              onPress={() => onCardPress?.(card)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={card.gradient}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={styles.cardGradient}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Right Column */}
      <View style={styles.column}>
        {rightColumn.map((card, index) => {
          const cardHeight = isAsymmetric
            ? index === 0 ? 140 : index === 1 ? 190 : 150
            : 165;

          return (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.cardWrapper,
                { height: cardHeight, borderColor: colors.cardBorder },
              ]}
              onPress={() => onCardPress?.(card)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={card.gradient}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={styles.cardGradient}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  cardWrapper: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  cardGradient: {
    flex: 1,
  },
});
