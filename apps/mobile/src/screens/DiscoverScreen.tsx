import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ShadowHeader } from '../components/ShadowHeader';
import { SearchBar } from '../components/SearchBar';
import { MediaGrid } from '../components/MediaGrid';
import { useTheme } from '../context/ThemeContext';
import { ExploreCategory, ExploreMediaCard } from '../types';

export default function DiscoverScreen({ navigation }: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>({});

  const mockProfiles = [
    { id: '1', name: 'Elena Rostova', username: 'elena.art', bio: 'Creative Director · 3D Specialist', followers: '18.2K', gradient: ['#EC4899', '#F43F5E', '#FB7185'] },
    { id: '2', name: 'Sofia Martinez', username: 'sofia.mtz', bio: 'Motion Designer @CyberVibe', followers: '12.9K', gradient: ['#3B82F6', '#8B5CF6', '#A855F7'] },
    { id: '3', name: 'Mauricio Lopez', username: 'maoo.lopez', bio: 'Founder @Shadow · Neo-digital design', followers: '24.5K', gradient: ['#FF0A78', '#7928CA', '#4338CA'] },
    { id: '4', name: 'Marco Rossi', username: 'marco.rossi', bio: 'Photographer · Tokyo cyber nightscapes', followers: '8.4K', gradient: ['#10B981', '#059669', '#047857'] },
    { id: '5', name: 'Aria Chen', username: 'aria.lens', bio: 'Editorial Stylist · Milan & New York', followers: '31.0K', gradient: ['#F59E0B', '#D97706', '#B45309'] },
  ];

  const mockTags = [
    { id: 't1', tag: 'cyberpunk', posts: '184.2K', category: 'Digital Art' },
    { id: 't2', tag: 'shadowart', posts: '142.8K', category: 'Aesthetics' },
    { id: 't3', tag: 'octanerender', posts: '98.4K', category: '3D Motion' },
    { id: 't4', tag: 'motiondesign', posts: '76.1K', category: 'Animation' },
    { id: 't5', tag: 'darkmode', posts: '64.9K', category: 'UI & Craft' },
    { id: 't6', tag: 'pawnrank', posts: '41.7K', category: 'Community' },
  ];

  const filteredProfiles = mockProfiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTags = mockTags.filter(
    (t) =>
      t.tag.toLowerCase().includes(searchQuery.toLowerCase().replace(/^#/, '')) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: ExploreCategory[] = [
    {
      id: 'igtv',
      title: 'IGTV',
      iconName: 'tv-outline',
      gradient: ['#7928CA', '#A855F7', '#C084FC'],
    },
    {
      id: 'tienda',
      title: 'CAMPUS',
      iconName: 'school-outline',
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
      title: 'WELLNESS',
      iconName: 'fitness-outline',
      gradient: ['#F97316', '#FB923C', '#F43F5E'],
    },
  ];

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
      height: 230,
      gradient: ['#0E7490', '#155E75', '#083344'],
      title: 'Teal Study #04',
    },
    {
      id: 'media_5',
      height: 150,
      gradient: ['#7A58E6', '#B77DE8', '#F5A7C4'],
      title: 'Pastel Sunrise',
    },
    {
      id: 'media_6',
      height: 180,
      gradient: ['#4E137D', '#791DA6', '#C724B1'],
      title: 'Neon Bloom',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header */}
      <ShadowHeader
        colors={colors}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onAddPress={() => navigation.navigate('Create')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        unreadCount={2}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* 2. Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          colors={colors}
          placeholder="Buscar creadores o #tags..."
        />

        {searchQuery.trim().length > 0 ? (
          <View style={styles.resultsContainer}>
            {/* Filtered Profiles */}
            {filteredProfiles.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, { color: colors.secondaryText }]}>
                  CREADORES ({filteredProfiles.length})
                </Text>
                {filteredProfiles.map((p) => {
                  const isFollowing = !!followedUsers[p.username];
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.profileItem, { borderBottomColor: colors.border }]}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('Profile')}
                    >
                      <LinearGradient colors={p.gradient} style={styles.profileAvatar} />
                      <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: colors.text }]}>{p.name}</Text>
                        <Text style={[styles.profileBio, { color: colors.secondaryText }]}>
                          @{p.username} · {p.followers}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.followBtn,
                          isFollowing
                            ? { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1 }
                            : { backgroundColor: colors.accent },
                        ]}
                        onPress={() =>
                          setFollowedUsers((prev) => ({ ...prev, [p.username]: !prev[p.username] }))
                        }
                      >
                        <Text
                          style={[
                            styles.followBtnText,
                            { color: isFollowing ? colors.secondaryText : '#FFFFFF' },
                          ]}
                        >
                          {isFollowing ? 'Siguiendo' : 'Seguir'}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Filtered Trending Tags */}
            {filteredTags.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, { color: colors.secondaryText }]}>
                  TENDENCIAS ({filteredTags.length})
                </Text>
                {filteredTags.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.tagItem, { borderBottomColor: colors.border }]}
                    activeOpacity={0.7}
                    onPress={() => setSearchQuery(`#${t.tag}`)}
                  >
                    <View style={[styles.tagIconWrap, { backgroundColor: colors.inputBackground }]}>
                      <Text style={[styles.tagHash, { color: colors.accent }]}>#</Text>
                    </View>
                    <View style={styles.tagInfo}>
                      <Text style={[styles.tagName, { color: colors.text }]}>#{t.tag}</Text>
                      <Text style={[styles.tagPosts, { color: colors.secondaryText }]}>
                        {t.posts} posts · {t.category}
                      </Text>
                    </View>
                    <Feather name="trending-up" size={14} color="#10B981" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {filteredProfiles.length === 0 && filteredTags.length === 0 && (
              <View style={styles.noResultsBox}>
                <Text style={[styles.noResultsTitle, { color: colors.text }]}>
                  Sin resultados para "{searchQuery}"
                </Text>
                <Text style={[styles.noResultsSub, { color: colors.secondaryText }]}>
                  Prueba buscando creadores o temas como #cyberpunk
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* 3. Category Horizontal Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() =>
                      setSelectedCategory(isSelected ? null : category.id)
                    }
                    activeOpacity={0.8}
                    style={[
                      styles.categoryPill,
                      { borderColor: colors.border, backgroundColor: colors.inputBackground },
                      isSelected && { borderColor: colors.accent, borderWidth: 1.5 },
                    ]}
                  >
                    <LinearGradient
                      colors={category.gradient}
                      style={styles.categoryIconWrap}
                    >
                      <Ionicons name={category.iconName as any} size={15} color="#FFFFFF" />
                    </LinearGradient>
                    <Text
                      style={[
                        styles.categoryTitle,
                        { color: colors.text },
                        isSelected && { color: colors.accent, fontWeight: '800' },
                      ]}
                    >
                      {category.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 4. Asymmetric Media Grid */}
            <MediaGrid
              cards={mediaCards}
              colors={colors}
              onCardPress={() => {}}
            />
          </>
        )}
      </ScrollView>
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
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingTop: 12,
    paddingBottom: 16,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  categoryIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileBio: {
    fontSize: 11,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  tagIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagHash: {
    fontSize: 18,
    fontWeight: '900',
  },
  tagInfo: {
    flex: 1,
    gap: 2,
  },
  tagName: {
    fontSize: 13,
    fontWeight: '700',
  },
  tagPosts: {
    fontSize: 11,
  },
  noResultsBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 6,
  },
  noResultsTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  noResultsSub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
