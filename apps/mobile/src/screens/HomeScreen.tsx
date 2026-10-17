import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ShadowHeader } from '../components/ShadowHeader';
import { StoryRow } from '../components/StoryRow';
import { PostCard } from '../components/PostCard';
import { ShareSheet } from '../components/ShareSheet';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../api/client';
import { Post } from '../types/api';
import { StoryItem } from '../types';
import MyShadowScreen from './MyShadowScreen';

interface HomeScreenProps {
  navigation: any;
  route: any;
}

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [isViewingMyShadow, setIsViewingMyShadow] = useState(false);

  // Real backend feed state
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSharePostId, setSelectedSharePostId] = useState<string | null>(null);
  const [isOfflineCached, setIsOfflineCached] = useState(false);
  const isLoadingMoreRef = useRef(false);

  // Load from cache immediately on startup
  useEffect(() => {
    try {
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        const raw = globalThis.localStorage.getItem('shadow_mobile_feed_cache');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.items) && parsed.items.length > 0) {
            setPosts(parsed.items);
            setIsLoading(false);
          }
        }
      }
    } catch (_) {}
  }, []);

  // Isolated demo stories for the visual concept header
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

  // Fetch real feed from API with offline fallback
  const loadFeed = useCallback(async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
      setNextCursor(null);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await apiClient.getFeed({ limit: 20 });
      setPosts(response.items);
      setNextCursor(response.nextCursor);
      setError(null);
      setIsOfflineCached(false);

      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.setItem(
          'shadow_mobile_feed_cache',
          JSON.stringify({ items: response.items, timestamp: Date.now() })
        );
      }
    } catch (err: any) {
      let hasCached = false;
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        const raw = globalThis.localStorage.getItem('shadow_mobile_feed_cache');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.items) && parsed.items.length > 0) {
              setPosts(parsed.items);
              setIsOfflineCached(true);
              hasCached = true;
              setError(null);
            }
          } catch (_) {}
        }
      }
      if (!hasCached) {
        setError(err?.message || 'Unable to load your feed.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const loadMorePosts = async () => {
    if (!nextCursor || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;

    try {
      const response = await apiClient.getFeed({ limit: 20, cursor: nextCursor });
      setPosts((prev) => [...prev, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      isLoadingMoreRef.current = false;
    }
  };

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Refresh if redirected back with postCreated param
  useEffect(() => {
    if (route.params?.postCreated) {
      navigation.setParams({ postCreated: undefined });
      loadFeed(true);
    }
  }, [route.params?.postCreated, loadFeed, navigation]);

  if (isViewingMyShadow) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MyShadowScreen
          onBack={() => setIsViewingMyShadow(false)}
          navigation={navigation}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Concept Shadow Header with Cursive Wordmark & Action Icons */}
      <ShadowHeader
        colors={colors}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onShadowPress={() => setIsViewingMyShadow(true)}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        unreadCount={2}
      />

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const distanceFromBottom =
            nativeEvent.contentSize.height -
            (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y);
          if (distanceFromBottom <= 300) {
            void loadMorePosts();
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadFeed(true)}
            tintColor={colors.accent}
          />
        }
      >
        {/* 2. Concept Story Row */}
        <StoryRow
          stories={stories}
          colors={colors}
          onStoryPress={() => {}}
        />

        {/* 3. Real Feed Posts in Concept Card Styling */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: colors.secondaryText }]}>{error}</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              No posts in your campus circle yet. Be the first to share!
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              colors={colors}
              onSharePress={(id) => setSelectedSharePostId(id)}
              onUserPress={() => navigation.navigate('Profile')}
            />
          ))
        )}

        {/* Pull Up to Refresh Feed */}
        {posts.length > 0 && (
          <View style={styles.pullUpContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => loadFeed(true)}
              style={[
                styles.pullUpButton,
                { backgroundColor: colors.elevatedSurface, borderColor: colors.border },
              ]}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Text style={[styles.pullUpText, { color: colors.secondaryText }]}>
                  ↑ Desliza hacia arriba para actualizar feed
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Share Sheet Modal */}
      {selectedSharePostId && (
        <ShareSheet
          visible={!!selectedSharePostId}
          onClose={() => setSelectedSharePostId(null)}
          colors={colors}
          postTitle="Shadow Campus Post"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollBody: {
    paddingBottom: 40,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  pullUpContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  pullUpButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pullUpText: {
    fontSize: 11,
    fontWeight: '700',
  },
  offlineBanner: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});
