import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
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
  size = 56,
}) => {
  const isHighlighted = story.hasUnseen || (story.isCurrentUser && story.hasUnseen !== false);
  const outerBorderColor = isHighlighted ? '#FF0A78' : colors.isDark ? '#38383D' : '#D1D5DB';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.avatarWrapper}>
        <View
          style={[
            styles.storyFrameOuter,
            {
              width: size,
              height: size,
              backgroundColor: outerBorderColor,
            },
          ]}
        >
          <View
            style={[
              styles.storyFrameInset,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.storyFrameInner}>
              {story.avatarUrl ? (
                <Image
                  source={{ uri: story.avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.charcoalPlaceholder} />
              )}
            </View>
          </View>
        </View>

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
    marginRight: 12,
    width: 58,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  storyFrameOuter: {
    borderRadius: 18,
    padding: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyFrameInset: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyFrameInner: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  charcoalPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 6,
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
