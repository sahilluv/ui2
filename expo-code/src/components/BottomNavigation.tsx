import React from 'react';
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
          style={styles.tabButton}
          onPress={() => onTabChange('home')}
          activeOpacity={0.7}
        >
          <View style={styles.homeIconWrapper}>
            <Ionicons
              name={currentTab === 'home' ? 'home' : 'home-outline'}
              size={isCompact ? 18 : 22}
              color={currentTab === 'home' ? colors.tabActive : colors.tabInactive}
            />
            {currentTab === 'home' && (
              <View style={[styles.activeUnderline, isCompact && styles.activeUnderlineCompact, { backgroundColor: colors.text }]} />
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
            size={isCompact ? 18 : 22}
            color={currentTab === 'explore' ? colors.tabActive : colors.tabInactive}
          />
          {currentTab === 'explore' && (
            <View style={[styles.activeUnderline, isCompact && styles.activeUnderlineCompact, { backgroundColor: colors.text }]} />
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
              size={isCompact ? 20 : 24}
              color={currentTab === 'reels' ? colors.tabActive : colors.tabInactive}
            />
            {currentTab === 'reels' && (
              <View style={[styles.activeUnderline, isCompact && styles.activeUnderlineCompact, { backgroundColor: colors.text }]} />
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
              size={isCompact ? 17 : 21}
              color={currentTab === 'shop' ? colors.tabActive : colors.tabInactive}
            />
            {currentTab === 'shop' && (
              <View style={[styles.activeUnderline, isCompact && styles.activeUnderlineCompact, { backgroundColor: colors.text }]} />
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
          {currentTab === 'profile' && (
            <View style={[styles.activeUnderline, isCompact && styles.activeUnderlineCompact, { backgroundColor: colors.text }]} />
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
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
  },
  containerCompact: {
    height: 40,
    borderRadius: 22,
    paddingHorizontal: 6,
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
  activeUnderlineCompact: {
    bottom: -4,
    width: 10,
    height: 2,
    borderRadius: 1,
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

