import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ShadowHeader } from '../components/ShadowHeader';
import { StoryRow } from '../components/StoryRow';
import { SearchBar } from '../components/SearchBar';
import { PostCard } from '../components/PostCard';
import { ShareSheet } from '../components/ShareSheet';
import { ThemeColors } from '../theme';
import { StoryItem, PostItem } from '../types';

interface HomeScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToCreate: () => void;
  onNavigateToProfile: () => void;
  onStoryPress?: (story: StoryItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  colors,
  isDark,
  onToggleTheme,
  onNavigateToNotifications,
  onNavigateToCreate,
  onNavigateToProfile,
  onStoryPress,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSharePost, setSelectedSharePost] = useState<PostItem | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Mock Stories matching the reference
  const stories: StoryItem[] = [
    {
      id: 'user_story',
      username: 'Tu historia',
      gradientColors: ['#FF0A78', '#991BEA', '#7928CA'],
      isCurrentUser: true,
    },
    {
      id: 'story_1',
      username: 'Ezequias',
      gradientColors: ['#FF6B4A', '#FF3366', '#C026D3'],
    },
    {
      id: 'story_2',
      username: 'Alice_002',
      gradientColors: ['#C026D3', '#7928CA', '#3B82F6'],
    },
    {
      id: 'story_3',
      username: 'Paulette_R',
      gradientColors: ['#FF2D55', '#B026FF', '#4F46E5'],
    },
    {
      id: 'story_4',
      username: 'Carlos_v',
      gradientColors: ['#06B6D4', '#3B82F6', '#6366F1'],
    },
  ];

  // Mock Posts matching the reference
  const posts: PostItem[] = [
    {
      id: 'post_1',
      author: {
        name: 'Maoo Lopez',
        username: 'Maoo.lopez',
        avatarGradient: ['#FF0A78', '#991BEA', '#6366F1'],
      },
      timeAgo: 'Hace 20 min',
      imageGradient: ['#4E137D', '#791DA6', '#C724B1', '#FF3B8A'],
      likesCount: 4558,
      commentsCount: 300,
      likedByText: 'danieldelax',
      captionTitle: 'SACRIFICE | VIRUS',
      captionBody: 'this photomanipulation inspired in the virus reality and organic surrealism.',
      totalPages: 2,
      currentPage: 1,
      isLiked: false,
    },
    {
      id: 'post_2',
      author: {
        name: 'Eliott Johnson',
        username: 'Eliott Johnson',
        avatarGradient: ['#6366F1', '#8B5CF6', '#EC4899'],
        location: 'Madrid, Spain',
      },
      timeAgo: 'Hace 2 h',
      imageGradient: ['#7A58E6', '#B77DE8', '#F5A7C4', '#FCD5B5'],
      likesCount: 2420,
      commentsCount: 175,
      likedByText: 'sofia_art',
      captionTitle: 'ETHEREAL LIGHT',
      captionBody: 'Capturing sunset reflections across the skyline of Madrid.',
      totalPages: 1,
      currentPage: 1,
      isLiked: true,
    },
    {
      id: 'post_3',
      author: {
        name: 'Christian Lue',
        username: 'Christian Lue',
        avatarGradient: ['#F59E0B', '#D97706', '#78350F'],
        location: 'Ghent, Belgium',
      },
      timeAgo: 'Hace 5 h',
      imageGradient: ['#3A2C27', '#5C3E33', '#855E4E', '#1F1714'],
      likesCount: 1890,
      commentsCount: 94,
      likedByText: 'marco.visuals',
      captionTitle: 'BRUTALIST FORMS',
      captionBody: 'Studies in concrete, shadow, and architectural permanence.',
      totalPages: 1,
      currentPage: 1,
      isLiked: false,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header with Shadow Script Logo */}
      <ShadowHeader
        colors={colors}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onAddPress={onNavigateToCreate}
        onNotificationsPress={onNavigateToNotifications}
        unreadCount={2}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* 2. Stories Row */}
        <StoryRow
          stories={stories}
          colors={colors}
          onStoryPress={onStoryPress}
        />

        {/* 3. Explorar Title + Search Bar */}
        <View style={styles.exploreSection}>
          <Text style={[styles.exploreHeading, { color: colors.text }]}>
            Explorar
          </Text>
          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              colors={colors}
              placeholder="Buscar"
            />
          </View>
        </View>

        {/* 4. Posts Feed */}
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            colors={colors}
            onUserPress={() => onNavigateToProfile()}
            onSharePress={() => setSelectedSharePost(post)}
          />
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 5. Custom Slide-Up Share Sheet */}
      <ShareSheet
        visible={!!selectedSharePost}
        post={selectedSharePost}
        colors={colors}
        isDark={isDark}
        onClose={() => setSelectedSharePost(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exploreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginVertical: 10,
    gap: 12,
  },
  exploreHeading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchWrapper: {
    flex: 1,
  },
});
