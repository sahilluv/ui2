export interface SourceFile {
  path: string;
  name: string;
  category: 'Root' | 'Theme' | 'Components' | 'Screens' | 'Types';
  description: string;
  code: string;
}

export const EXPO_SOURCE_FILES: SourceFile[] = [
  {
    path: 'package.json',
    name: 'package.json',
    category: 'Root',
    description: 'Expo 51 configuration, scripts, and production dependencies.',
    code: `{
  "name": "shadow-mobile-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "expo-linear-gradient": "~13.0.2",
    "@expo/vector-icons": "^14.0.0",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "react-native-safe-area-context": "4.10.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  },
  "private": true
}`
  },
  {
    path: 'App.tsx',
    name: 'App.tsx',
    category: 'Root',
    description: 'Main application root, Theme state, SafeArea, StatusBar, and BottomNavigation.',
    code: `import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { lightColors, darkColors } from './src/theme';
import { TabType, ThemeMode } from './src/types';
import { BottomNavigation } from './src/components/BottomNavigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { ReelsScreen } from './src/screens/ReelsScreen';
import { CreateScreen } from './src/screens/CreateScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);

  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigateToNotifications={() => setCurrentTab('notifications')}
            onNavigateToCreate={() => setCurrentTab('create')}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
      case 'explore':
        return (
          <ExploreScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigateToNotifications={() => setCurrentTab('notifications')}
            onNavigateToCreate={() => setCurrentTab('create')}
          />
        );
      case 'reels':
        return (
          <ReelsScreen
            colors={colors}
            isDark={isDark}
            onAuthorPress={() => setCurrentTab('profile')}
          />
        );
      case 'shop':
        return (
          <ExploreScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigateToNotifications={() => setCurrentTab('notifications')}
            onNavigateToCreate={() => setCurrentTab('create')}
          />
        );
      case 'create':
        return (
          <CreateScreen
            colors={colors}
            isDark={isDark}
            onClose={() => setCurrentTab('home')}
            onPostCreated={() => setCurrentTab('home')}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            colors={colors}
            isDark={isDark}
            onNavigateBack={() => setCurrentTab('home')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onAddPress={() => setCurrentTab('create')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        {/* Active Screen Content */}
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* 5-Destination Integrated Bottom Navigation */}
        <BottomNavigation
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'notifications') setHasUnreadNotifs(false);
            setCurrentTab(tab);
          }}
          colors={colors}
          unreadNotifications={hasUnreadNotifs}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});`
  },
  {
    path: 'src/theme/index.ts',
    name: 'theme/index.ts',
    category: 'Theme',
    description: 'Design tokens for light/dark colors, gradients, radiuses, and spacing.',
    code: `export interface ThemeColors {
  background: string;
  surface: string;
  elevatedSurface: string;
  text: string;
  secondaryText: string;
  tertiaryText: string;
  border: string;
  cardBorder: string;
  inputBackground: string;
  badgeBackground: string;
  accent: string;
  accentGradient: [string, string, ...string[]];
  storyGradient: [string, string, string];
  heartRed: string;
  tabActive: string;
  tabInactive: string;
  divider: string;
}

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  elevatedSurface: '#F7F8FC',
  text: '#11121C',
  secondaryText: '#828799',
  tertiaryText: '#A1A6B6',
  border: 'rgba(0, 0, 0, 0.07)',
  cardBorder: 'rgba(0, 0, 0, 0.05)',
  inputBackground: '#F0F2F7',
  badgeBackground: '#7B52B9',
  accent: '#7B52B9',
  accentGradient: ['#7B52B9', '#8456C5', '#5E3A89'],
  storyGradient: ['#7B52B9', '#8456C5', '#5E3A89'],
  heartRed: '#FF2A55',
  tabActive: '#12131D',
  tabInactive: '#A4A8B7',
  divider: '#EEF0F5',
};

export const darkColors: ThemeColors = {
  background: '#0B0C13',
  surface: '#121420',
  elevatedSurface: '#191C2D',
  text: '#FFFFFF',
  secondaryText: '#878C9E',
  tertiaryText: '#595E72',
  border: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
  inputBackground: '#181A28',
  badgeBackground: '#7B52B9',
  accent: '#7B52B9',
  accentGradient: ['#7B52B9', '#8456C5', '#5E3A89'],
  storyGradient: ['#7B52B9', '#8456C5', '#5E3A89'],
  heartRed: '#FF2A55',
  tabActive: '#FFFFFF',
  tabInactive: '#636779',
  divider: '#1A1C28',
};

export const shadowGradients = {
  mainFeed: ['#4E137D', '#791DA6', '#C724B1', '#FF3B8A'],
  softPastel: ['#7A58E6', '#B77DE8', '#F5A7C4', '#FCD5B5'],
  deepMoody: ['#232A3B', '#161B26', '#0F131D'],
  tealCyan: ['#0A3A40', '#0E626B', '#13928E', '#20C997'],
  warmBronze: ['#3A2C27', '#5C3E33', '#855E4E'],
  categoryTV: ['#7928CA', '#A855F7'],
  categoryShop: ['#7B52B9', '#5E3A89'],
  categoryTravel: ['#06B6D4', '#3B82F6'],
  categoryFitness: ['#F97316', '#FB7185'],
};

export const themeRadius = {
  sm: 8,
  md: 14,
  lg: 20,
  card: 26,
  full: 9999,
};`
  },
  {
    path: 'src/types/index.ts',
    name: 'types/index.ts',
    category: 'Types',
    description: 'TypeScript interfaces for Stories, Posts, Highlights, Categories, and Tabs.',
    code: `export type TabType = 'home' | 'explore' | 'reels' | 'shop' | 'profile' | 'create' | 'notifications';
export type ThemeMode = 'light' | 'dark';

export interface ReelItem {
  id: string;
  author: {
    name: string;
    username: string;
    location: string;
    avatarGradient: [string, string, ...string[]];
  };
  gradient: [string, string, ...string[]];
  likes: string;
  likesCount: number;
  comments: string;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  audioTrack?: string;
  caption?: string;
}

export interface StoryItem {
  id: string;
  username: string;
  avatarUrl?: string;
  gradientColors: [string, string, ...string[]];
  isCurrentUser?: boolean;
  hasUnseen?: boolean;
}

export interface PostItem {
  id: string;
  author: {
    name: string;
    username: string;
    avatarGradient: [string, string, ...string[]];
    location?: string;
  };
  timeAgo: string;
  imageGradient: [string, string, ...string[]];
  likesCount: number;
  commentsCount: number;
  likedByText: string;
  captionTitle: string;
  captionBody: string;
  totalPages?: number;
  currentPage?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ExploreCategory {
  id: string;
  title: string;
  iconName: string;
  gradient: [string, string, ...string[]];
}

export interface ExploreMediaCard {
  id: string;
  height: number;
  gradient: [string, string, ...string[]];
  aspectRatio?: number;
  title?: string;
  likes?: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  isAdd?: boolean;
  gradient: [string, string, ...string[]];
}

export interface NotificationItemData {
  id: string;
  user: {
    name: string;
    username: string;
    avatarGradient: [string, string, ...string[]];
  };
  actionType: 'like' | 'comment' | 'follow' | 'mention';
  content: string;
  timeAgo: string;
  postThumbnailGradient?: [string, string, ...string[]];
  isRead: boolean;
}`
  },
  {
    path: 'src/components/ShadowHeader.tsx',
    name: 'components/ShadowHeader.tsx',
    category: 'Components',
    description: 'Header with cursive script wordmark, add button, theme toggle, and unread notification badge.',
    code: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';

interface ShadowHeaderProps {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme?: () => void;
  onAddPress?: () => void;
  onNotificationsPress?: () => void;
  unreadCount?: number;
}

export const ShadowHeader: React.FC<ShadowHeaderProps> = ({
  colors,
  isDark,
  onToggleTheme,
  onAddPress,
  onNotificationsPress,
  unreadCount = 2,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={[styles.iconButton, { borderColor: colors.border }]} 
        onPress={onAddPress}
        activeOpacity={0.7}
      >
        <Feather name="plus" size={20} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.brandContainer}>
        <Text style={[styles.brandText, { color: colors.text }]}>Shadow</Text>
      </View>

      <View style={styles.rightGroup}>
        {onToggleTheme && (
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: colors.inputBackground }]} 
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDark ? "sunny-outline" : "moon-outline"} 
              size={16} 
              color={colors.text} 
            />
          </TouchableOpacity>
        )}

        {/* Top Right Corner + Button */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onAddPress}
          activeOpacity={0.7}
        >
          <Feather name="plus-square" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onNotificationsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="heart-outline" size={22} color={colors.text} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.badgeBackground }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});`
  },
  {
    path: 'src/components/PostCard.tsx',
    name: 'components/PostCard.tsx',
    category: 'Components',
    description: 'Post card with rounded media, red heart pill, pagination dots, floating controls, and captions.',
    code: `import React, { useState } from 'react';
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

  const handleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => (nextState ? prev + 1 : prev - 1));
    onLikePress?.(post.id);
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
              {post.author.location ? \`\${post.author.location} • \` : ''}{post.timeAgo}
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
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
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
          {post.totalPages && post.totalPages > 1 && (
            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>
                {post.currentPage || 1}/{post.totalPages}
              </Text>
            </View>
          )}

          {/* Floating Engagement Controls */}
          <View style={styles.floatingControls}>
            <TouchableOpacity
              style={[styles.heartPill, { backgroundColor: colors.heartRed }]}
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

            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={[styles.dot, styles.dotInactive]} />
              <View style={[styles.dot, styles.dotInactive]} />
            </View>

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

        <TouchableOpacity onPress={() => onCommentPress?.(post.id)} activeOpacity={0.7}>
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
  },
  metaContainer: {
    marginTop: 12,
    paddingHorizontal: 2,
    gap: 6,
  },
  likedByText: {
    fontSize: 12,
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
});`
  },
  {
    path: 'src/components/BottomNavigation.tsx',
    name: 'components/BottomNavigation.tsx',
    category: 'Components',
    description: 'Compact integrated bottom bar with 5 destinations, TV play monitor Reels button, and profile ring.',
    code: `import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TabType } from '../types';
import { ThemeColors } from '../theme';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  colors: ThemeColors;
  userAvatarGradient?: [string, string, ...string[]];
  unreadNotifications?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  colors,
  userAvatarGradient = ['#7B52B9', '#8456C5', '#5E3A89'],
  unreadNotifications = false,
}) => {
  return (
    <View style={styles.floatingWrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* 1. Home */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('home')}
          activeOpacity={0.7}
        >
          <View style={styles.homeIconWrapper}>
            <Ionicons
              name={currentTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={currentTab === 'home' ? colors.tabActive : colors.tabInactive}
            />
            {currentTab === 'home' && (
              <View style={[styles.activeUnderline, { backgroundColor: colors.text }]} />
            )}
          </View>
        </TouchableOpacity>

        {/* 2. Discover / Search */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('explore')}
          activeOpacity={0.7}
        >
          <Feather
            name="search"
            size={22}
            color={currentTab === 'explore' ? colors.tabActive : colors.tabInactive}
          />
          {currentTab === 'explore' && (
            <View style={[styles.activeUnderline, { backgroundColor: colors.text }]} />
          )}
        </TouchableOpacity>

        {/* 3. Reels Section (TV Monitor with Play Icon from Reference) */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('reels')}
          activeOpacity={0.7}
        >
          <View style={styles.reelIconWrapper}>
            <MaterialCommunityIcons
              name={currentTab === 'reels' ? 'television-play' : 'television-play'}
              size={24}
              color={currentTab === 'reels' ? colors.tabActive : colors.tabInactive}
            />
            {currentTab === 'reels' && (
              <View style={[styles.activeUnderline, { backgroundColor: colors.text }]} />
            )}
          </View>
        </TouchableOpacity>

        {/* 4. Shop / Basket */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('shop')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Feather
              name="shopping-bag"
              size={21}
              color={currentTab === 'shop' ? colors.tabActive : colors.tabInactive}
            />
            {currentTab === 'shop' && (
              <View style={[styles.activeUnderline, { backgroundColor: colors.text }]} />
            )}
          </View>
        </TouchableOpacity>

        {/* 5. Profile (Circular Avatar with Vibrant Gradient Ring) */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('profile')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={userAvatarGradient}
            style={[
              styles.profileRing,
              currentTab === 'profile' && {
                shadowColor: colors.accent,
                shadowOpacity: 0.6,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
          >
            <View
              style={[
                styles.profileInner,
                { backgroundColor: colors.surface },
              ]}
            >
              <LinearGradient
                colors={userAvatarGradient}
                style={styles.profileAvatar}
              />
            </View>
          </LinearGradient>
          {currentTab === 'profile' && (
            <View style={[styles.activeUnderline, { backgroundColor: colors.text }]} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 4,
  },
  container: {
    height: 56,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  homeIconWrapper: {
    alignItems: 'center',
  },
  reelIconWrapper: {
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: -6,
    width: 14,
    height: 2.5,
    borderRadius: 1.5,
  },
  profileRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    padding: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    padding: 1.5,
  },
  profileAvatar: {
    flex: 1,
    borderRadius: 10,
  },
});`
  },
  {
    path: 'src/components/ProfileHeader.tsx',
    name: 'components/ProfileHeader.tsx',
    category: 'Components',
    description: 'Mauricio Lopez profile header with stats, gradient follow button, highlights, and tabs.',
    code: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import { HighlightItem } from '../types';

interface ProfileHeaderProps {
  colors: ThemeColors;
  isFollowing: boolean;
  onToggleFollow: () => void;
  activeTab: 'posts' | 'tags' | 'igtv';
  onTabChange: (tab: 'posts' | 'tags' | 'igtv') => void;
  highlights: HighlightItem[];
  onHighlightPress?: (item: HighlightItem) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  colors,
  isFollowing,
  onToggleFollow,
  activeTab,
  onTabChange,
  highlights,
  onHighlightPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarSection}>
        <LinearGradient
          colors={['#7B52B9', '#8456C5', '#5E3A89']}
          style={styles.avatarRing}
        >
          <View style={[styles.avatarGap, { backgroundColor: colors.background }]}>
            <LinearGradient
              colors={['#7B52B9', '#8456C5', '#5E3A89']}
              style={styles.avatarGradient}
            />
          </View>
        </LinearGradient>

        <Text style={[styles.displayName, { color: colors.text }]}>Mauricio Lopez</Text>
        <Text style={[styles.bioText, { color: colors.secondaryText }]}>
          Diseñador visual y Fotografía - Villahermosa, México
        </Text>
        <Text style={[styles.bioTags, { color: colors.accent }]}>
          #lifestyle #design #photography #urban #art
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>735</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>post</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>876</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>seguidores</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>568</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>seguidos</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onToggleFollow} style={styles.actionBtnContainer}>
        <LinearGradient
          colors={isFollowing ? ['#353849', '#242634'] : colors.accentGradient}
          style={styles.followButton}
        >
          <Text style={styles.followButtonText}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsContainer}>
        {highlights.map((highlight) => (
          <TouchableOpacity
            key={highlight.id}
            style={styles.highlightItem}
            onPress={() => onHighlightPress?.(highlight)}
          >
            <View style={styles.highlightCircleWrapper}>
              <LinearGradient colors={highlight.gradient} style={styles.highlightRing}>
                <View style={[styles.highlightInner, { backgroundColor: colors.background }]}>
                  <LinearGradient colors={highlight.gradient} style={styles.highlightFill} />
                </View>
              </LinearGradient>
              {highlight.isAdd && (
                <View style={[styles.highlightPlusBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                  <Feather name="plus" size={10} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text style={[styles.highlightTitle, { color: colors.secondaryText }]}>{highlight.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
        {(['posts', 'tags', 'igtv'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => onTabChange(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.text : colors.secondaryText }]}>
              {tab === 'posts' ? 'Post' : tab === 'tags' ? 'Etiquetas' : 'IGTV'}
            </Text>
            {activeTab === tab && <View style={[styles.tabUnderline, { backgroundColor: colors.text }]} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
  avatarSection: { alignItems: 'center', paddingHorizontal: 24 },
  avatarRing: { width: 90, height: 90, borderRadius: 45, padding: 3, marginBottom: 14 },
  avatarGap: { width: '100%', height: '100%', borderRadius: 42, padding: 3 },
  avatarGradient: { flex: 1, borderRadius: 39 },
  displayName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  bioText: { fontSize: 12, textAlign: 'center', marginBottom: 4 },
  bioTags: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 36, marginBottom: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 2 },
  actionBtnContainer: { paddingHorizontal: 36, marginBottom: 20 },
  followButton: { height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  followButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  highlightsContainer: { paddingHorizontal: 18, gap: 14, marginBottom: 20 },
  highlightItem: { alignItems: 'center', width: 64 },
  highlightCircleWrapper: { position: 'relative', marginBottom: 6 },
  highlightRing: { width: 60, height: 60, borderRadius: 30, padding: 2 },
  highlightInner: { width: '100%', height: '100%', borderRadius: 28, padding: 2 },
  highlightFill: { flex: 1, borderRadius: 26 },
  highlightPlusBadge: { position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  highlightTitle: { fontSize: 11, textAlign: 'center' },
  tabsRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, paddingHorizontal: 18 },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', position: 'relative' },
  tabText: { fontSize: 13, fontWeight: '600' },
  tabUnderline: { position: 'absolute', bottom: 0, height: 2, width: '40%', borderRadius: 1 },
});`
  },
  {
    path: 'src/components/ShareSheet.tsx',
    name: 'components/ShareSheet.tsx',
    category: 'Components',
    description: 'Custom slide-up bottom Share sheet with Copy Link, Share to Story, and Send to Friends options.',
    code: `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { PostItem } from '../types';
import { ThemeColors } from '../theme';

interface ShareSheetProps {
  visible: boolean;
  post: PostItem | null;
  colors: ThemeColors;
  isDark?: boolean;
  onClose: () => void;
  onCopyLink?: (post: PostItem) => void;
  onShareToStory?: (post: PostItem) => void;
  onSendToFriends?: (post: PostItem) => void;
}

const RECENT_FRIENDS = [
  { id: 'f1', name: 'Ezequias', username: 'ezequias.art', avatarGradient: ['#FF6B4A', '#FF3366', '#C026D3'] },
  { id: 'f2', name: 'Alice', username: 'alice_002', avatarGradient: ['#C026D3', '#7928CA', '#3B82F6'] },
  { id: 'f3', name: 'Paulette', username: 'paulette_r', avatarGradient: ['#FF2D55', '#B026FF', '#4F46E5'] },
  { id: 'f4', name: 'Carlos', username: 'carlos_v', avatarGradient: ['#06B6D4', '#3B82F6', '#6366F1'] },
];

export const ShareSheet: React.FC<ShareSheetProps> = ({
  visible,
  post,
  colors,
  isDark = true,
  onClose,
  onCopyLink,
  onShareToStory,
  onSendToFriends,
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedToStory, setSharedToStory] = useState(false);
  const [sentFriends, setSentFriends] = useState<{ [id: string]: boolean }>({});

  if (!post) return null;

  const handleCopyLink = () => {
    setCopied(true);
    onCopyLink?.(post);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToStory = () => {
    setSharedToStory(true);
    onShareToStory?.(post);
    setTimeout(() => {
      setSharedToStory(false);
      onClose();
    }, 1200);
  };

  const handleToggleSendFriend = (friendId: string) => {
    setSentFriends((prev) => ({ ...prev, [friendId]: !prev[friendId] }));
    onSendToFriends?.(post);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#141624' : '#FFFFFF' }]}>
              <View style={styles.handleBar} />

              <View style={styles.headerRow}>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#12131D' }]}>
                  Compartir publicación
                </Text>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                  <Feather name="x" size={20} color={isDark ? '#94A3B8' : '#64748B'} />
                </TouchableOpacity>
              </View>

              {/* Options: Copy Link, Share to Story, Send to Friends */}
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionItem} onPress={handleCopyLink} activeOpacity={0.8}>
                  <View style={[styles.actionIconCircle, { backgroundColor: copied ? '#10B981' : (isDark ? '#23273D' : '#F1F5F9') }]}>
                    <Feather name={copied ? 'check' : 'link-2'} size={22} color={copied ? '#FFFFFF' : (isDark ? '#FFFFFF' : '#12131D')} />
                  </View>
                  <Text style={[styles.actionLabel, { color: copied ? '#10B981' : (isDark ? '#E2E8F0' : '#1E293B') }]}>
                    {copied ? '¡Copiado!' : 'Copiar enlace'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={handleShareToStory} activeOpacity={0.8}>
                  <LinearGradient colors={['#7B52B9', '#8456C5', '#5E3A89']} style={styles.actionIconCircle}>
                    <Ionicons name={sharedToStory ? 'checkmark' : 'add-circle-outline'} size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.actionLabel, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                    {sharedToStory ? '¡Publicado!' : 'Tu historia'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => onSendToFriends?.(post)} activeOpacity={0.8}>
                  <View style={[styles.actionIconCircle, { backgroundColor: isDark ? '#23273D' : '#F1F5F9' }]}>
                    <Feather name="send" size={20} color={isDark ? '#FFFFFF' : '#12131D'} />
                  </View>
                  <Text style={[styles.actionLabel, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                    Enviar a amigos
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Friends List */}
              <View style={styles.friendsList}>
                {RECENT_FRIENDS.map((f) => (
                  <View key={f.id} style={styles.friendRow}>
                    <View style={styles.friendLeft}>
                      <LinearGradient colors={f.avatarGradient} style={styles.friendAvatar} />
                      <Text style={[styles.friendName, { color: isDark ? '#FFFFFF' : '#12131D' }]}>{f.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleToggleSendFriend(f.id)} style={styles.sendButton}>
                      <Text style={styles.sendButtonText}>{sentFriends[f.id] ? 'Enviado' : 'Enviar'}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheetContainer: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, paddingBottom: 36 },
  handleBar: { width: 44, height: 5, borderRadius: 3, backgroundColor: 'rgba(148,163,184,0.4)', alignSelf: 'center', marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  closeBtn: { padding: 6 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  actionItem: { alignItems: 'center', gap: 8, minWidth: 84 },
  actionIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 12, fontWeight: '700' },
  friendsList: { gap: 10, marginTop: 4 },
  friendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  friendLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  friendAvatar: { width: 36, height: 36, borderRadius: 18 },
  friendName: { fontSize: 14, fontWeight: '700' },
  sendButton: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' },
  sendButtonText: { fontSize: 12, fontWeight: '700', color: '#0EA5E9' },
});`
  },
  {
    path: 'src/screens/HomeScreen.tsx',
    name: 'screens/HomeScreen.tsx',
    category: 'Screens',
    description: 'Home Feed with Stories row, Explorar title, Search control, PostCard share trigger, and slide-up ShareSheet.',
    code: `import React, { useState } from 'react';
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

  const stories: StoryItem[] = [
    { id: 'user_story', username: 'Tu historia', gradientColors: ['#7B52B9', '#8456C5', '#5E3A89'], isCurrentUser: true },
    { id: 'story_1', username: 'Ezequias', gradientColors: ['#FF6B4A', '#FF3366', '#C026D3'] },
    { id: 'story_2', username: 'Alice_002', gradientColors: ['#C026D3', '#7928CA', '#3B82F6'] },
    { id: 'story_3', username: 'Paulette_R', gradientColors: ['#FF2D55', '#B026FF', '#4F46E5'] },
    { id: 'story_4', username: 'Carlos_v', gradientColors: ['#06B6D4', '#3B82F6', '#6366F1'] },
  ];

  const posts: PostItem[] = [
    {
      id: 'post_1',
      author: { name: 'Maoo Lopez', username: 'Maoo.lopez', avatarGradient: ['#7B52B9', '#8456C5', '#5E3A89'] },
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
      author: { name: 'Eliott Johnson', username: 'Eliott Johnson', avatarGradient: ['#6366F1', '#8B5CF6', '#7B52B9'], location: 'Madrid, Spain' },
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
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        <StoryRow stories={stories} colors={colors} onStoryPress={onStoryPress} />

        <View style={styles.exploreSection}>
          <Text style={[styles.exploreHeading, { color: colors.text }]}>Explorar</Text>
          <View style={styles.searchWrapper}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} colors={colors} placeholder="Buscar" />
          </View>
        </View>

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

      {/* Custom Slide-Up Share Sheet */}
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
  container: { flex: 1 },
  exploreSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginVertical: 10, gap: 12 },
  exploreHeading: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  searchWrapper: { flex: 1 },
});`
  },
  {
    path: 'src/screens/ExploreScreen.tsx',
    name: 'screens/ExploreScreen.tsx',
    category: 'Screens',
    description: 'Explore screen with category cards (IGTV, TIENDA, VIAJES, FITNESS) and asymmetric media grid.',
    code: `import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ShadowHeader } from '../components/ShadowHeader';
import { SearchBar } from '../components/SearchBar';
import { MediaGrid } from '../components/MediaGrid';
import { ThemeColors } from '../theme';
import { ExploreCategory, ExploreMediaCard } from '../types';

interface ExploreScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToCreate: () => void;
  onCardPress?: (card: ExploreMediaCard) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  colors,
  isDark,
  onToggleTheme,
  onNavigateToNotifications,
  onNavigateToCreate,
  onCardPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: ExploreCategory[] = [
    { id: 'igtv', title: 'IGTV', iconName: 'tv-outline', gradient: ['#7928CA', '#A855F7', '#C084FC'] },
    { id: 'tienda', title: 'TIENDA', iconName: 'bag-handle-outline', gradient: ['#7B52B9', '#8456C5', '#5E3A89'] },
    { id: 'viajes', title: 'VIAJES', iconName: 'airplane-outline', gradient: ['#06B6D4', '#0EA5E9', '#3B82F6'] },
    { id: 'fitness', title: 'FITNESS', iconName: 'barbell-outline', gradient: ['#F97316', '#FB923C', '#F43F5E'] },
  ];

  const mediaCards: ExploreMediaCard[] = [
    { id: 'm_1', height: 210, gradient: ['#283344', '#1A222E', '#0E131A'] },
    { id: 'm_2', height: 140, gradient: ['#581C87', '#7E22CE', '#9333EA'] },
    { id: 'm_3', height: 160, gradient: ['#1E1B4B', '#312E81', '#4338CA'] },
    { id: 'm_4', height: 190, gradient: ['#4E137D', '#991BEA', '#7B52B9'] },
    { id: 'm_5', height: 180, gradient: ['#0F766E', '#14B8A6', '#2DD4BF'] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ShadowHeader
        colors={colors}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onAddPress={onNavigateToCreate}
        onNotificationsPress={onNavigateToNotifications}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCardWrapper}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <LinearGradient colors={cat.gradient} style={styles.categoryCardGradient}>
                <Ionicons name={cat.iconName as any} size={22} color="#FFFFFF" />
                <Text style={styles.categoryTitle}>{cat.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.searchContainer}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} colors={colors} placeholder="Buscar" showScanIcon={true} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Populares</Text>
        </View>

        <MediaGrid cards={mediaCards} colors={colors} onCardPress={onCardPress} isAsymmetric={true} />
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  categoriesContainer: { paddingHorizontal: 18, paddingVertical: 12, gap: 12 },
  categoryCardWrapper: { width: 76, height: 76, borderRadius: 20, overflow: 'hidden' },
  categoryCardGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8, gap: 6 },
  categoryTitle: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  searchContainer: { paddingHorizontal: 18, marginVertical: 10 },
  sectionHeader: { paddingHorizontal: 18, marginTop: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
});`
  },
  {
    path: 'src/screens/ReelsScreen.tsx',
    name: 'screens/ReelsScreen.tsx',
    category: 'Screens',
    description: 'Reels Section with vertical stacked portrait cards, author row, and floating engagement pill with likes, comments, and bookmark.',
    code: `import React, { useState, useCallback } from 'react';
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
        id: \`reel_\${Date.now()}\`,
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            tintColor={isDark ? '#FFFFFF' : '#7B52B9'}
            colors={['#7B52B9', '#8456C5', '#5E3A89']}
            progressBackgroundColor={isDark ? '#1C1D2D' : '#FFFFFF'}
          />
        }
      >
        {reels.map((reel) => (
          <View key={reel.id} style={styles.cardWrapper}>
            <LinearGradient
              colors={reel.gradient}
              start={{ x: 0.2, y: 0.1 }}
              end={{ x: 0.8, y: 0.95 }}
              style={styles.gradientCard}
            >
              {/* Author Header */}
              <View style={styles.authorHeader}>
                <TouchableOpacity
                  style={styles.authorInfo}
                  onPress={() => onAuthorPress?.(reel.author.username)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={reel.author.avatarGradient}
                    style={styles.authorAvatar}
                  />
                  <View style={styles.authorMeta}>
                    <Text style={styles.authorName}>{reel.author.name}</Text>
                    <Text style={styles.authorLocation}>{reel.author.location}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                  <Feather name="more-vertical" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Floating Bottom Engagement Pill */}
              <View style={styles.floatingPillContainer}>
                <View style={styles.floatingPill}>
                  {/* Like Button */}
                  <TouchableOpacity
                    style={styles.pillAction}
                    onPress={() => toggleLike(reel.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={reel.isLiked ? 'heart' : 'heart-outline'}
                      size={18}
                      color={reel.isLiked ? '#FF2A55' : '#12131D'}
                    />
                    <Text style={styles.pillText}>{reel.likes}</Text>
                  </TouchableOpacity>

                  <View style={styles.pillDivider} />

                  {/* Comment Button */}
                  <TouchableOpacity
                    style={styles.pillAction}
                    onPress={() => onCommentsPress?.(reel.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={16}
                      color="#12131D"
                    />
                    <Text style={styles.pillText}>{reel.comments}</Text>
                  </TouchableOpacity>

                  <View style={styles.pillDivider} />

                  {/* Bookmark Button */}
                  <TouchableOpacity
                    style={styles.bookmarkAction}
                    onPress={() => toggleSave(reel.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={reel.isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={17}
                      color={reel.isSaved ? '#7928CA' : '#12131D'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    gap: 0,
  },
  cardWrapper: {
    width: '100%',
    height: REEL_CARD_HEIGHT,
    borderRadius: 0,
    overflow: 'hidden',
  },
  gradientCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: Platform.OS === 'ios' ? 84 : 70,
    justifyContent: 'space-between',
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  authorMeta: {
    justifyContent: 'center',
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  authorLocation: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  moreButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingPillContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  floatingPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  pillAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillText: {
    color: '#12131D',
    fontSize: 13,
    fontWeight: '800',
  },
  pillDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
  },
  bookmarkAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});`
  },
  {
    path: 'src/screens/ProfileScreen.tsx',
    name: 'screens/ProfileScreen.tsx',
    category: 'Screens',
    description: 'Profile Screen for Mauricio Lopez with follower metrics, highlight circles, and media grid.',
    code: `import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ProfileHeader } from '../components/ProfileHeader';
import { MediaGrid } from '../components/MediaGrid';
import { ThemeColors } from '../theme';
import { HighlightItem, ExploreMediaCard } from '../types';

interface ProfileScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateBack?: () => void;
  onAddPress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  colors,
  isDark,
  onToggleTheme,
  onAddPress,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'tags' | 'igtv'>('posts');

  const highlights: HighlightItem[] = [
    { id: 'hl_1', title: 'Mejores fotos', isAdd: true, gradient: ['#164E63', '#0E7490', '#06B6D4'] },
    { id: 'hl_2', title: 'Mis viajes', gradient: ['#1E1B4B', '#312E81', '#4F46E5'] },
    { id: 'hl_3', title: 'Otoño', gradient: ['#14532D', '#15803D', '#16A34A'] },
    { id: 'hl_4', title: 'Comida', gradient: ['#451A03', '#92400E', '#D97706'] },
  ];

  const profileCards: ExploreMediaCard[] = [
    { id: 'p_1', height: 175, gradient: ['#0E7490', '#155E75', '#083344'] },
    { id: 'p_2', height: 175, gradient: ['#1E1B4B', '#2E1065', '#3B0764'] },
    { id: 'p_3', height: 175, gradient: ['#3F3F46', '#27272A', '#18181B'] },
    { id: 'p_4', height: 175, gradient: ['#15803D', '#166534', '#14532D'] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          colors={colors}
          isFollowing={isFollowing}
          onToggleFollow={() => setIsFollowing(!isFollowing)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          highlights={highlights}
        />
        <MediaGrid cards={profileCards} colors={colors} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});`
  },
  {
    path: 'src/screens/CreateScreen.tsx',
    name: 'screens/CreateScreen.tsx',
    category: 'Screens',
    description: 'Post Composer with gradient card selector, caption input, format tabs, and publish action.',
    code: `import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors, shadowGradients } from '../theme';

interface CreateScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onPostCreated?: (newPost: any) => void;
  onClose?: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({
  colors,
  isDark,
  onPostCreated,
  onClose,
}) => {
  const [captionTitle, setCaptionTitle] = useState('');
  const [captionBody, setCaptionBody] = useState('');
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);

  const presets = [
    { id: '1', colors: shadowGradients.mainFeed },
    { id: '2', colors: shadowGradients.softPastel },
    { id: '3', colors: shadowGradients.deepMoody },
    { id: '4', colors: shadowGradients.tealCyan },
  ];

  const handlePublish = () => {
    if (!captionTitle.trim() && !captionBody.trim()) {
      Alert.alert('Requerido', 'Por favor ingresa un título o descripción.');
      return;
    }
    onPostCreated?.({});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Nueva Publicación</Text>
        <TouchableOpacity onPress={handlePublish} style={styles.publishBtn}>
          <Text style={styles.publishText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        <LinearGradient
          colors={presets[selectedGradientIndex].colors}
          style={styles.previewCard}
        />
        <TextInput
          placeholder="Título del concepto..."
          placeholderTextColor={colors.secondaryText}
          value={captionTitle}
          onChangeText={setCaptionTitle}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <TextInput
          placeholder="Escribe una descripción..."
          placeholderTextColor={colors.secondaryText}
          value={captionBody}
          onChangeText={setCaptionBody}
          multiline
          numberOfLines={3}
          style={[styles.input, { color: colors.text, borderColor: colors.border, height: 80 }]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  publishBtn: { backgroundColor: '#7B52B9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  publishText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  body: { padding: 16 },
  previewCard: { width: '100%', height: 280, borderRadius: 24, marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 14, marginBottom: 12 },
});`
  },
  {
    path: 'src/screens/NotificationsScreen.tsx',
    name: 'screens/NotificationsScreen.tsx',
    category: 'Screens',
    description: 'Notifications list with interaction pills, user avatars, and timestamps.',
    code: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeColors } from '../theme';

interface NotificationsScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onNavigateBack?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ colors }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Notificaciones</Text>
      </View>
      <ScrollView style={styles.list}>
        <View style={styles.item}>
          <Text style={[styles.itemText, { color: colors.text }]}>
            <Text style={{ fontWeight: '700' }}>Elena.art</Text> le gustó tu publicación
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 56, justifyContent: 'center', paddingHorizontal: 18 },
  title: { fontSize: 20, fontWeight: '800' },
  list: { padding: 16 },
  item: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.1)' },
  itemText: { fontSize: 13 },
});`
  }
];
