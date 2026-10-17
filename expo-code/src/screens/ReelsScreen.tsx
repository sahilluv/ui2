import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ReelCommentsDrawer } from '../components/ReelCommentsDrawer';
import { ReelItem } from '../types';
import { ThemeColors } from '../theme';

const { width, height } = Dimensions.get('window');

// Maximum full-screen immersive vertical snapping layout
const REEL_CARD_HEIGHT = height;
const REEL_CARD_GAP = 0;
const SNAP_INTERVAL = REEL_CARD_HEIGHT;

interface ReelsScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onCommentsPress?: (reelId: string) => void;
  onAuthorPress?: (username: string) => void;
}

export const ReelsScreen: React.FC<ReelsScreenProps> = ({
  colors,
  isDark,
  onCommentsPress,
  onAuthorPress,
}) => {
  const [reels, setReels] = useState<ReelItem[]>([
    {
      id: 'reel_1',
      author: {
        name: 'Eliott Johnson',
        username: 'eliott.j',
        location: 'Madrid, Spain',
        avatarGradient: ['#3A3B4D', '#2B2C3B', '#1E1F2A'],
      },
      gradient: ['#796A9E', '#AA86B7', '#DCAABF', '#F4CCD8'],
      likes: '2,4k',
      likesCount: 2400,
      comments: '175',
      commentsCount: 175,
      isLiked: true,
      isSaved: false,
    },
    {
      id: 'reel_2',
      author: {
        name: 'Christian Lue',
        username: 'christian.lue',
        location: 'Ghent, Belgium',
        avatarGradient: ['#473F3A', '#38302C', '#241E1C'],
      },
      gradient: ['#433833', '#68544B', '#967B6D', '#BFA695'],
      likes: '1,8k',
      likesCount: 1800,
      comments: '92',
      commentsCount: 92,
      isLiked: false,
      isSaved: true,
    },
    {
      id: 'reel_3',
      author: {
        name: 'Sofia Martinez',
        username: 'sofia.mtz',
        location: 'Tokyo, Japan',
        avatarGradient: ['#1A2536', '#131C2A', '#0D1420'],
      },
      gradient: ['#1A365D', '#2B6CB0', '#4299E1', '#90CDF4'],
      likes: '3,9k',
      likesCount: 3900,
      comments: '340',
      commentsCount: 340,
      isLiked: false,
      isSaved: false,
    },
  ]);

  const toggleLike = (id: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextLiked = !r.isLiked;
          return {
            ...r,
            isLiked: nextLiked,
            likes: nextLiked ? '2,4k' : '2,3k',
          };
        }
        return r;
      })
    );
  };

  const toggleSave = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  // Pull-to-refresh state and handler for fetching new cinematic reels
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate network fetch for new high-fidelity reels
    setTimeout(() => {
      const newReel: ReelItem = {
        id: `reel_${Date.now()}`,
        author: {
          name: 'Elena Rostova',
          username: 'elena.lens',
          location: 'Reykjavik, Iceland',
          avatarGradient: ['#065F46', '#047857', '#10B981'],
        },
        gradient: ['#042F2E', '#0D9488', '#2DD4BF', '#99F6E4'],
        likes: '5,2k',
        likesCount: 5200,
        comments: '412',
        commentsCount: 412,
        isLiked: false,
        isSaved: false,
      };

      setReels((prev) => [newReel, ...prev.filter((r) => r.id !== newReel.id)]);
      setRefreshing(false);
    }, 1200);
  }, []);

  // Slide-up comment drawer state
  const [activeCommentReel, setActiveCommentReel] = useState<ReelItem | null>(null);

  const handleAddComment = (reelId: string, text: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextCount = r.commentsCount + 1;
          return {
            ...r,
            commentsCount: nextCount,
            comments: String(nextCount),
          };
        }
        return r;
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B0C13' : '#F5F6FA' }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        pagingEnabled={true}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={Platform.OS === 'android'}
        refreshing={refreshing}
        onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#FFFFFF' : '#FF0A78'}
            colors={['#FF0A78', '#7928CA', '#06B6D4']}
            progressBackgroundColor={isDark ? '#1C1D2D' : '#FFFFFF'}
          />
        }
      >
        {reels.map((reel) => (
          <View key={reel.id} style={styles.cardContainer}>
            <LinearGradient
              colors={reel.gradient}
              start={{ x: 0.2, y: 0.0 }}
              end={{ x: 0.8, y: 1.0 }}
              style={styles.reelCard}
            >
              {/* Top Author Row */}
              <View style={styles.authorRow}>
                <TouchableOpacity
                  style={styles.authorLeft}
                  onPress={() => onAuthorPress?.(reel.author.username)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={reel.author.avatarGradient}
                    style={styles.avatar}
                  />
                  <View style={styles.authorTextGroup}>
                    <Text style={styles.authorName}>{reel.author.name}</Text>
                    <Text style={styles.authorLocation}>{reel.author.location}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                  <Feather name="more-vertical" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Floating Engagement Capsule Pill (Matching Attachment Exactly) */}
              <View style={styles.floatingEngagementPill}>
                {/* Heart Button + Count */}
                <TouchableOpacity
                  style={styles.pillSection}
                  onPress={() => toggleLike(reel.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={reel.isLiked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={reel.isLiked ? '#FF2A55' : '#12131D'}
                  />
                  <Text style={styles.pillText}>{reel.likes}</Text>
                </TouchableOpacity>

                {/* Divider 1 */}
                <View style={styles.pillDivider} />

                {/* Comment Button + Count */}
                <TouchableOpacity
                  style={styles.pillSection}
                  onPress={() => {
                    setActiveCommentReel(reel);
                    onCommentsPress?.(reel.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-outline" size={18} color="#12131D" />
                  <Text style={styles.pillText}>{reel.comments}</Text>
                </TouchableOpacity>

                {/* Divider 2 */}
                <View style={styles.pillDivider} />

                {/* Bookmark Button */}
                <TouchableOpacity
                  style={styles.pillIconOnly}
                  onPress={() => toggleSave(reel.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={reel.isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={19}
                    color={reel.isSaved ? '#7928CA' : '#12131D'}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Slide-Up Comments Drawer for Cinematic Reels */}
      <ReelCommentsDrawer
        visible={!!activeCommentReel}
        reel={activeCommentReel}
        colors={colors}
        isDark={isDark}
        onClose={() => setActiveCommentReel(null)}
        onAddComment={handleAddComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 0,
  },
  cardContainer: {
    width: '100%',
    height: REEL_CARD_HEIGHT,
    borderRadius: 0,
    overflow: 'hidden',
  },
  reelCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: Platform.OS === 'ios' ? 84 : 70,
    justifyContent: 'space-between',
    borderRadius: 0,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
  },
  authorTextGroup: {
    justifyContent: 'center',
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  authorLocation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  moreButton: {
    padding: 6,
  },
  floatingEngagementPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 8,
  },
  pillSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
  },
  pillIconOnly: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    color: '#12131D',
    fontSize: 14,
    fontWeight: '700',
  },
  pillDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});
