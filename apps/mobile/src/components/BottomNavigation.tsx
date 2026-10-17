import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
  isCompact?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  colors,
  userAvatarGradient = ['#FF0A78', '#991BEA', '#6366F1'],
  unreadNotifications = false,
  isCompact = false,
}) => {
  return (
    <View style={[styles.floatingWrapper, isCompact && styles.floatingWrapperCompact]}>
      <View
        style={[
          styles.container,
          isCompact && styles.containerCompact,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* 1. Home */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === 'home' && styles.tabButtonActive,
            currentTab === 'home' && {
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)',
              borderColor: colors.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.6)',
            },
          ]}
          onPress={() => onTabChange('home')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Ionicons
              name={currentTab === 'home' ? 'home' : 'home-outline'}
              size={isCompact ? 18 : 22}
              color={currentTab === 'home' ? colors.tabActive : colors.tabInactive}
            />
          </View>
        </TouchableOpacity>

        {/* 2. Discover / Search */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === 'explore' && styles.tabButtonActive,
            currentTab === 'explore' && {
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)',
              borderColor: colors.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.6)',
            },
          ]}
          onPress={() => onTabChange('explore')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Feather
              name="search"
              size={isCompact ? 18 : 22}
              color={currentTab === 'explore' ? colors.tabActive : colors.tabInactive}
            />
          </View>
        </TouchableOpacity>

        {/* 3. Reels Section (TV Monitor with Play Icon) */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === 'reels' && styles.tabButtonActive,
            currentTab === 'reels' && {
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)',
              borderColor: colors.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.6)',
            },
          ]}
          onPress={() => onTabChange('reels')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="television-play"
              size={isCompact ? 20 : 24}
              color={currentTab === 'reels' ? colors.tabActive : colors.tabInactive}
            />
          </View>
        </TouchableOpacity>

        {/* 4. Chat / Direct Messages */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            (currentTab === 'chat' || currentTab === 'shop') && styles.tabButtonActive,
            (currentTab === 'chat' || currentTab === 'shop') && {
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)',
              borderColor: colors.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.6)',
            },
          ]}
          onPress={() => onTabChange('chat')}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Feather
              name="message-circle"
              size={isCompact ? 18 : 22}
              color={currentTab === 'chat' || currentTab === 'shop' ? colors.tabActive : colors.tabInactive}
            />
            {unreadNotifications && (
              <View style={[styles.chatBadge, { backgroundColor: colors.accent || '#FF0A78' }]} />
            )}
          </View>
        </TouchableOpacity>

        {/* 5. Profile */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentTab === 'profile' && styles.tabButtonActive,
            currentTab === 'profile' && {
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.85)',
              borderColor: colors.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.6)',
            },
          ]}
          onPress={() => onTabChange('profile')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={userAvatarGradient}
            style={[
              styles.profileRing,
              isCompact && styles.profileRingCompact,
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
  floatingWrapperCompact: {
    paddingHorizontal: 32,
    paddingBottom: 4,
    paddingTop: 2,
  },
  container: {
    height: 56,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  containerCompact: {
    height: 40,
    borderRadius: 22,
  },
  tabButton: {
    flex: 1,
    height: '84%',
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    zIndex: 2,
  },
  tabButtonActive: {
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  profileRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    padding: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRingCompact: {
    width: 22,
    height: 22,
    borderRadius: 11,
    padding: 1,
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
});
