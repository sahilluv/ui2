import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors, shadowGradients } from '../theme';
import { GradientRing } from './GradientRing';
import { Post } from '../types/api';
import { PostItem } from '../types';

const { width } = Dimensions.get('window');

const gradientList: [string, string, ...string[]][] = [
  ['#4E137D', '#791DA6', '#C724B1', '#FF3B8A'],
  ['#7A58E6', '#B77DE8', '#F5A7C4', '#FCD5B5'],
  ['#232A3B', '#161B26', '#0F131D'],
  ['#0A3A40', '#0E626B', '#13928E', '#20C997'],
  ['#3A2C27', '#5C3E33', '#855E4E'],
];

const avatarGradientList: [string, string, ...string[]][] = [
  ['#FF0A78', '#991BEA', '#6366F1'],
  ['#6366F1', '#8B5CF6', '#EC4899'],
  ['#06B6D4', '#3B82F6', '#6366F1'],
  ['#EC4899', '#F43F5E', '#FB7185'],
  ['#10B981', '#059669', '#047857'],
];

function formatTimeAgo(dateStr?: string) {
  if (!dateStr) return 'Just now';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const mins = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface PostCardProps {
  post: Post | PostItem;
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
  // Determine if it's a real Post from API or a concept PostItem
  const isRealPost = 'author' in post && typeof (post as any).content === 'string';
  const realPost = post as Post;
  const conceptPost = post as PostItem;

  const id = post.id;
  const authorName = isRealPost ? realPost.author?.name || 'Shadow user' : conceptPost.author?.name || 'User';
  const username = isRealPost
    ? authorName.toLowerCase().replace(/\s+/g, '.')
    : conceptPost.author?.username || authorName;

  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarGradient = isRealPost
    ? avatarGradientList[hash % avatarGradientList.length]
    : conceptPost.author?.avatarGradient || avatarGradientList[0];
  const imageGradient = isRealPost
    ? gradientList[hash % gradientList.length]
    : conceptPost.imageGradient || gradientList[0];

  const timeAgo = isRealPost ? formatTimeAgo(realPost.createdAt) : conceptPost.timeAgo || 'Just now';
  const captionTitle = isRealPost ? '' : conceptPost.captionTitle || '';
  const captionBody = isRealPost ? realPost.content : conceptPost.captionBody || '';

  const [isLiked, setIsLiked] = useState(conceptPost.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(conceptPost.likesCount ?? (hash % 45 + 5));
  const [isSaved, setIsSaved] = useState(conceptPost.isSaved ?? false);

  const handleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    onLikePress?.(id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onBookmarkPress?.(id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* 1. Author Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorRow}
          onPress={() => onUserPress?.(username)}
          activeOpacity={0.8}
        >
          <GradientRing
            size={36}
            strokeWidth={2}
            gradientColors={avatarGradient}
            backgroundColor={colors.surface}
          >
            <LinearGradient
              colors={avatarGradient}
              style={styles.avatarInner}
            >
              <Text style={styles.avatarInitial}>
                {authorName.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          </GradientRing>
          <View style={styles.authorMeta}>
            <Text style={[styles.authorUsername, { color: colors.text }]}>
              {username}
            </Text>
            <Text style={[styles.timeAgo, { color: colors.secondaryText }]}>
              {timeAgo}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onSharePress?.(id)}
            activeOpacity={0.7}
          >
            <Feather name="send" size={19} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Media Area (Rounded Cinematic Gradient Card with real content) */}
      <View style={styles.mediaContainer}>
        <LinearGradient
          colors={imageGradient}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.95, y: 0.95 }}
          style={styles.mediaCard}
        >
          {/* Content overlay in case of text-rich post */}
          <View style={styles.mediaContentOverlay}>
            <Text style={styles.mediaContentText} numberOfLines={4}>
              {captionBody}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* 3. Action Bar */}
      <View style={styles.actionsBar}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? colors.heartRed : colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onCommentPress?.(id)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={21} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onSharePress?.(id)}
            activeOpacity={0.7}
          >
            <Feather name="send" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* 4. Likes Counter */}
      <View style={styles.likesSection}>
        <Text style={[styles.likesText, { color: colors.text }]}>
          {likesCount.toLocaleString()} <Text style={{ fontWeight: '400' }}>likes</Text>
        </Text>
      </View>

      {/* 5. Caption Area */}
      <View style={styles.captionSection}>
        {captionTitle ? (
          <Text style={[styles.captionTitle, { color: colors.text }]}>
            {captionTitle}
          </Text>
        ) : null}
        <Text style={[styles.captionBody, { color: colors.secondaryText }]}>
          <Text style={[styles.captionAuthor, { color: colors.text }]}>{username} </Text>
          {captionBody}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  authorMeta: {
    flex: 1,
  },
  authorUsername: {
    fontSize: 13,
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
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
  mediaContainer: {
    paddingHorizontal: 14,
  },
  mediaCard: {
    width: '100%',
    height: width * 0.72,
    borderRadius: 20,
    padding: 18,
    justifyContent: 'flex-end',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  mediaContentOverlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 14,
    padding: 12,
  },
  mediaContentText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  likesSection: {
    paddingHorizontal: 18,
    marginTop: 4,
  },
  likesText: {
    fontSize: 13,
    fontWeight: '700',
  },
  captionSection: {
    paddingHorizontal: 18,
    marginTop: 6,
  },
  captionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  captionAuthor: {
    fontWeight: '700',
  },
  captionBody: {
    fontSize: 13,
    lineHeight: 18,
  },
});
