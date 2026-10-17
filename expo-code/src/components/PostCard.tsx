import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PostItem } from '../types';
import { ThemeColors } from '../theme';
import { GradientRing } from './GradientRing';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: PostItem;
  colors: ThemeColors;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
  onBookmarkPress?: (postId: string) => void;
  onUserPress?: (username: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  colors,
  onLikePress,
  onCommentPress,
  onSharePress,
  onBookmarkPress,
  onUserPress,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);

  const handleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => (nextState ? prev + 1 : prev - 1));
    onLikePress?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onBookmarkPress?.(post.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* 1. Author Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorRow}
          onPress={() => onUserPress?.(post.author.username)}
          activeOpacity={0.8}
        >
          <GradientRing
            size={36}
            strokeWidth={2}
            gradientColors={post.author.avatarGradient}
            backgroundColor={colors.surface}
          >
            <LinearGradient
              colors={post.author.avatarGradient}
              style={styles.avatarInner}
            />
          </GradientRing>
          <View style={styles.authorMeta}>
            <Text style={[styles.authorUsername, { color: colors.text }]}>
              {post.author.username}
            </Text>
            <Text style={[styles.timeAgo, { color: colors.secondaryText }]}>
              {post.author.location ? `${post.author.location} • ` : ''}{post.timeAgo}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onSharePress?.(post.id)}
            activeOpacity={0.7}
          >
            <Feather name="send" size={19} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="grid-outline" size={17} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Media Area (Rounded Cinematic Gradient Card) */}
      <View style={styles.mediaContainer}>
        <LinearGradient
          colors={post.imageGradient}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.95, y: 0.95 }}
          style={styles.mediaCard}
        >
          {/* Top-Right Page Indicator (e.g. 1/2) */}
          {post.totalPages && post.totalPages > 1 && (
            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>
                {post.currentPage || 1}/{post.totalPages}
              </Text>
            </View>
          )}

          {/* Floating Engagement Controls (Bottom Overlay) */}
          <View style={styles.floatingControls}>
            {/* Heart Like Pill */}
            <TouchableOpacity
              style={[
                styles.heartPill,
                { backgroundColor: colors.heartRed },
              ]}
              onPress={handleLike}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.heartCountText}>
                {likesCount.toLocaleString()}
              </Text>
            </TouchableOpacity>

            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={[styles.dot, styles.dotInactive]} />
              <View style={[styles.dot, styles.dotInactive]} />
            </View>

            {/* Floating Action Button (Comment / Bookmark) */}
            <TouchableOpacity
              style={[styles.floatingCircleBtn, { backgroundColor: '#FFFFFF' }]}
              onPress={() => onCommentPress?.(post.id)}
              activeOpacity={0.85}
            >
              <Ionicons name="chatbubble-outline" size={16} color="#11121C" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* 3. Caption & Social Proof Metadata */}
      <View style={styles.metaContainer}>
        <Text style={[styles.likedByText, { color: colors.secondaryText }]}>
          Les gusta a <Text style={{ fontWeight: '700', color: colors.text }}>danieldelax</Text> y{' '}
          <Text style={{ fontWeight: '700', color: colors.text }}>{likesCount.toLocaleString()} personas más</Text>
        </Text>

        <Text style={styles.captionText} numberOfLines={3}>
          <Text style={[styles.captionTitle, { color: colors.text }]}>
            {post.captionTitle}{' '}
          </Text>
          <Text style={[styles.captionBody, { color: colors.secondaryText }]}>
            {post.captionBody}
          </Text>
        </Text>

        <TouchableOpacity
          onPress={() => onCommentPress?.(post.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.commentsPrompt, { color: colors.secondaryText }]}>
            Ver los {post.commentsCount} comentarios
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  authorMeta: {
    justifyContent: 'center',
  },
  authorUsername: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  timeAgo: {
    fontSize: 11,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  mediaContainer: {
    width: '100%',
    height: width * 0.98,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#7928CA',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  mediaCard: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  pageBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  floatingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  heartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#FF2A55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  heartCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
  },
  dotActive: {
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  floatingCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  metaContainer: {
    marginTop: 12,
    paddingHorizontal: 2,
    gap: 6,
  },
  likedByText: {
    fontSize: 12,
    lineHeight: 16,
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
  },
  captionTitle: {
    fontWeight: '800',
  },
  captionBody: {
    fontWeight: '400',
  },
  commentsPrompt: {
    fontSize: 12,
    marginTop: 2,
  },
});
