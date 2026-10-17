import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { GradientRing } from './GradientRing';
import { StoryItem } from '../types';
import { ThemeColors } from '../theme';

interface StoryAvatarProps {
  story: StoryItem;
  colors: ThemeColors;
  onPress?: () => void;
  size?: number;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({
  story,
  colors,
  onPress,
  size = 64,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarWrapper}>
        <GradientRing
          size={size}
          strokeWidth={2.5}
          gradientColors={story.gradientColors}
          backgroundColor={colors.background}
        >
          {story.avatarUrl ? (
            <Image
              source={{ uri: story.avatarUrl }}
              style={[
                styles.avatarImage,
                { borderRadius: (size - 10) / 2 },
              ]}
            />
          ) : (
            <LinearGradient
              colors={story.gradientColors}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={[
                styles.avatarImage,
                { borderRadius: (size - 10) / 2 },
              ]}
            />
          )}
        </GradientRing>

        {/* User Story Plus Badge */}
        {story.isCurrentUser && (
          <LinearGradient
            colors={colors.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.plusBadge, { borderColor: colors.background }]}
          >
            <Feather name="plus" size={11} color="#FFFFFF" />
          </LinearGradient>
        )}
      </View>

      <Text
        style={[styles.username, { color: colors.secondaryText }]}
        numberOfLines={1}
      >
        {story.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
