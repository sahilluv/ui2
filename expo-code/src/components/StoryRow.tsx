import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StoryAvatar } from './StoryAvatar';
import { StoryItem } from '../types';
import { ThemeColors } from '../theme';

interface StoryRowProps {
  stories: StoryItem[];
  colors: ThemeColors;
  onStoryPress?: (story: StoryItem) => void;
}

export const StoryRow: React.FC<StoryRowProps> = ({
  stories,
  colors,
  onStoryPress,
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
            onPress={() => onStoryPress?.(story)}
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
  },
});
