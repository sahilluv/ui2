import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ProfileHeader } from '../components/ProfileHeader';
import { MediaGrid } from '../components/MediaGrid';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { HighlightItem, ExploreMediaCard } from '../types';

export default function ProfileScreen({ navigation }: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { identity, logout } = useSession();

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'tags' | 'igtv'>('posts');

  const highlights: HighlightItem[] = [
    {
      id: 'hl_1',
      title: 'Campus Life',
      isAdd: true,
      gradient: ['#164E63', '#0E7490', '#06B6D4'],
    },
    {
      id: 'hl_2',
      title: 'Projects',
      gradient: ['#1E1B4B', '#312E81', '#4F46E5'],
    },
    {
      id: 'hl_3',
      title: 'Hackathons',
      gradient: ['#14532D', '#15803D', '#16A34A'],
    },
    {
      id: 'hl_4',
      title: 'Moments',
      gradient: ['#451A03', '#92400E', '#D97706'],
    },
  ];

  const profileCards: ExploreMediaCard[] = [
    {
      id: 'p_1',
      height: 175,
      gradient: ['#0E7490', '#155E75', '#083344'],
      title: 'Campus Quad',
    },
    {
      id: 'p_2',
      height: 175,
      gradient: ['#334155', '#1E293B', '#0F172A'],
      title: 'Tech Symposium',
    },
    {
      id: 'p_3',
      height: 175,
      gradient: ['#4E137D', '#791DA6', '#C724B1'],
      title: 'Night Lab Session',
    },
    {
      id: 'p_4',
      height: 175,
      gradient: ['#7A58E6', '#B77DE8', '#F5A7C4'],
      title: 'Finals Demo',
    },
  ];

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir de Shadow?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: () => {
          void logout();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header with Icons */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Create')}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Scrollable Profile Area with Real Shadow Identity */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <ProfileHeader
          colors={colors}
          isFollowing={isFollowing}
          onToggleFollow={() => setIsFollowing((prev) => !prev)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          highlights={highlights}
          displayName={identity?.name || undefined}
          email={identity?.email || undefined}
          bio={identity?.profile?.bio || undefined}
          shadowRank={identity?.shadowRank?.rankType || undefined}
          verificationStatus={identity?.verification?.status || undefined}
          shadowId={identity?.shadow?.id || undefined}
          onLogout={handleLogout}
        />

        {/* 3. Media Grid */}
        <MediaGrid
          cards={profileCards}
          colors={colors}
          onCardPress={() => {}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scrollBody: {
    paddingBottom: 40,
  },
});
