import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StoryAvatar } from './StoryAvatar';
import { StoryItem } from '../types';
import { ThemeColors } from '../theme';

interface StoryRowProps {
  stories: StoryItem[];
  colors: ThemeColors;
  onStoryPress?: (story: StoryItem) => void;
  onCameraPress?: () => void;
}

export const StoryRow: React.FC<StoryRowProps> = ({
  stories,
  colors,
  onStoryPress,
  onCameraPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story) => (
          <StoryAvatar
            key={story.id}
            story={story}
            colors={colors}
            onPress={() => {
              if (story.isCurrentUser && onCameraPress) {
                onCameraPress();
              } else {
                onStoryPress?.(story);
              }
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 8,
  },
  cameraBtnWrap: {
    alignItems: 'center',
    marginRight: 6,
    gap: 5,
  },
  cameraCircle: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
