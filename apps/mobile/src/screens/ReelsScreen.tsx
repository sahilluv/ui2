import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ReelCommentsDrawer } from '../components/ReelCommentsDrawer';
import { useTheme } from '../context/ThemeContext';
import { ReelItem } from '../types';

const { width, height } = Dimensions.get('window');
const REEL_CARD_HEIGHT = height;
const REEL_CARD_GAP = 0;
const SNAP_INTERVAL = REEL_CARD_HEIGHT;

export default function ReelsScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();

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
        avatarGradient: ['#1B2A4A', '#283E6B', '#3B5998'],
      },
      gradient: ['#1A2B4C', '#2C4A7A', '#4A72B0', '#7AA5E0'],
      likes: '3,8k',
      likesCount: 3820,
      comments: '290',
      commentsCount: 290,
      isLiked: false,
      isSaved: true,
    },
  ]);

  const [activeCommentsReel, setActiveCommentsReel] = useState<ReelItem | null>(null);

  const handleToggleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      {/* Top Floating Transparent Header */}
      <View style={styles.topHeader}>
        <Text style={styles.reelsTitle}>Reels</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Create')}>
          <Feather name="camera" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        pagingEnabled={Platform.OS === 'android'}
        contentContainerStyle={styles.scrollContent}
      >
        {reels.map((reel) => (
          <View key={reel.id} style={styles.reelCardWrapper}>
            <LinearGradient
              colors={reel.gradient}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.reelMediaCard}
            >
              <View style={styles.contentOverlay}>
                <View style={styles.authorBadge}>
                  <Text style={styles.authorName}>{reel.author.name}</Text>
                  <Text style={styles.location}>{reel.author.location}</Text>
                </View>

                {/* Right Action Stack */}
                <View style={styles.rightActionStack}>
                  <TouchableOpacity
                    onPress={() => handleToggleLike(reel.id)}
                    style={styles.actionBtn}
                  >
                    <Ionicons
                      name={reel.isLiked ? 'heart' : 'heart-outline'}
                      size={28}
                      color={reel.isLiked ? colors.heartRed : '#FFF'}
                    />
                    <Text style={styles.actionCount}>{reel.likesCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setActiveCommentsReel(reel)}
                    style={styles.actionBtn}
                  >
                    <Ionicons name="chatbubble-outline" size={26} color="#FFF" />
                    <Text style={styles.actionCount}>{reel.commentsCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="send" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Reel Comments Drawer */}
      <ReelCommentsDrawer
        visible={!!activeCommentsReel}
        onClose={() => setActiveCommentsReel(null)}
        reel={activeCommentsReel}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 12,
    left: 0,
    right: 0,
    zIndex: 20,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  reelsTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  headerBtn: {
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    gap: 0,
  },
  reelCardWrapper: {
    height: REEL_CARD_HEIGHT,
    width: width,
    borderRadius: 0,
    overflow: 'hidden',
  },
  reelMediaCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 84 : 70,
    justifyContent: 'flex-end',
  },
  contentOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  authorBadge: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '75%',
  },
  authorName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  location: {
    color: '#DDD',
    fontSize: 11,
    marginTop: 2,
  },
  rightActionStack: {
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCount: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
});
