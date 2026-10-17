import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

  // Categories matching the reference screenshot: IGTV, TIENDA, VIAJES, FITNESS
  const categories: ExploreCategory[] = [
    {
      id: 'igtv',
      title: 'IGTV',
      iconName: 'tv-outline',
      gradient: ['#7928CA', '#A855F7', '#C084FC'],
    },
    {
      id: 'tienda',
      title: 'TIENDA',
      iconName: 'bag-handle-outline',
      gradient: ['#EC4899', '#F43F5E', '#FB7185'],
    },
    {
      id: 'viajes',
      title: 'VIAJES',
      iconName: 'airplane-outline',
      gradient: ['#06B6D4', '#0EA5E9', '#3B82F6'],
    },
    {
      id: 'fitness',
      title: 'FITNESS',
      iconName: 'barbell-outline',
      gradient: ['#F97316', '#FB923C', '#F43F5E'],
    },
  ];

  // Asymmetric Media Cards matching the reference
  const mediaCards: ExploreMediaCard[] = [
    {
      id: 'media_1',
      height: 210,
      gradient: ['#283344', '#1A222E', '#0E131A'],
      title: 'Deep Obsidian',
    },
    {
      id: 'media_2',
      height: 140,
      gradient: ['#581C87', '#7E22CE', '#9333EA'],
      title: 'Midnight Ultraviolet',
    },
    {
      id: 'media_3',
      height: 160,
      gradient: ['#1E1B4B', '#312E81', '#4338CA'],
      title: 'Electric Indigo',
    },
    {
      id: 'media_4',
      height: 190,
      gradient: ['#4E137D', '#991BEA', '#FF0A78'],
      title: 'Radiant Cyberwave',
    },
    {
      id: 'media_5',
      height: 180,
      gradient: ['#0F766E', '#14B8A6', '#2DD4BF'],
      title: 'Emerald Mirage',
    },
    {
      id: 'media_6',
      height: 150,
      gradient: ['#831843', '#BE185D', '#DB2777'],
      title: 'Velvet Noir',
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
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Category Cards Row (IGTV, TIENDA, VIAJES, FITNESS) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCardWrapper,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={cat.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryCardGradient}
                >
                  <Ionicons name={cat.iconName as any} size={22} color="#FFFFFF" />
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 3. Search Bar with Scanner Icon */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            colors={colors}
            placeholder="Buscar"
            showScanIcon={true}
            onScanPress={() => {}}
          />
        </View>

        {/* 4. Populares (Trending / Popular) Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Populares
          </Text>
        </View>

        {/* 5. Asymmetric Rounded Media Grid */}
        <MediaGrid
          cards={mediaCards}
          colors={colors}
          onCardPress={onCardPress}
          isAsymmetric={true}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 12,
  },
  categoryCardWrapper: {
    width: 76,
    height: 76,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryCardSelected: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.04 }],
  },
  categoryCardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  searchContainer: {
    paddingHorizontal: 18,
    marginVertical: 10,
  },
  sectionHeader: {
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
});
