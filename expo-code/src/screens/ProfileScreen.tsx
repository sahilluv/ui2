import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
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
  onSettingsPress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  colors,
  isDark,
  onToggleTheme,
  onNavigateBack,
  onAddPress,
  onSettingsPress,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'tags' | 'igtv'>('posts');

  // Story highlights matching reference screenshot: Mejores fotos, Mis viajes, Otoño, Comida
  const highlights: HighlightItem[] = [
    {
      id: 'hl_1',
      title: 'Mejores fotos',
      isAdd: true,
      gradient: ['#164E63', '#0E7490', '#06B6D4'],
    },
    {
      id: 'hl_2',
      title: 'Mis viajes',
      gradient: ['#1E1B4B', '#312E81', '#4F46E5'],
    },
    {
      id: 'hl_3',
      title: 'Otoño',
      gradient: ['#14532D', '#15803D', '#16A34A'],
    },
    {
      id: 'hl_4',
      title: 'Comida',
      gradient: ['#451A03', '#92400E', '#D97706'],
    },
  ];

  // Profile Grid items (matching the teal & deep indigo cards from reference)
  const profileCards: ExploreMediaCard[] = [
    {
      id: 'p_1',
      height: 175,
      gradient: ['#0E7490', '#155E75', '#083344'],
      title: 'Teal Study',
    },
    {
      id: 'p_2',
      height: 175,
      gradient: ['#334155', '#1E293B', '#0F172A'],
      title: 'Obsidian Monolith',
    },
    {
      id: 'p_3',
      height: 175,
      gradient: ['#4E137D', '#791DA6', '#C724B1'],
      title: 'Ultraviolet Neon',
    },
    {
      id: 'p_4',
      height: 175,
      gradient: ['#7A58E6', '#B77DE8', '#F5A7C4'],
      title: 'Pastel Dusk',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header with Icons */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={onAddPress}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={onSettingsPress}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Profile Details & Stats */}
        <ProfileHeader
          colors={colors}
          isFollowing={isFollowing}
          onToggleFollow={() => setIsFollowing(!isFollowing)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          highlights={highlights}
        />

        {/* 3. Media Grid */}
        <View style={styles.gridSection}>
          <MediaGrid
            cards={profileCards}
            colors={colors}
            isAsymmetric={false}
          />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gridSection: {
    marginTop: 16,
  },
});
