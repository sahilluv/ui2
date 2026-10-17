import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
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
      {/* 1. Large Profile Avatar */}
      <View style={styles.avatarSection}>
        <LinearGradient
          colors={['#FF0A78', '#991BEA', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRing}
        >
          <View style={[styles.avatarGap, { backgroundColor: colors.background }]}>
            <LinearGradient
              colors={['#FF0A78', '#7928CA', '#4338CA']}
              style={styles.avatarGradient}
            />
          </View>
        </LinearGradient>

        <Text style={[styles.displayName, { color: colors.text }]}>
          Mauricio Lopez
        </Text>
        <Text style={[styles.usernameText, { color: colors.secondaryText }]}>
          @maoo.lopez
        </Text>

        {/* Real Shadow Identity Card */}
        <View style={[styles.identityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.identityIdRow}>
            <Text style={[styles.identityBadgeLabel, { color: colors.secondaryText }]}>
              SHADOW ID:
            </Text>
            <Text style={[styles.identityBadgeValue, { color: colors.text }]}>
              shdw_mlopez89
            </Text>
          </View>
          <View style={styles.badgeSubRow}>
            <View style={[styles.rankTag, { backgroundColor: colors.accent + '20', borderColor: colors.accent + '50' }]}>
              <Text style={[styles.rankTagText, { color: colors.accent }]}>
                ♙ PAWN · RANK I
              </Text>
            </View>
            <View style={[styles.verificationTag, { backgroundColor: '#10B98120', borderColor: '#10B98150' }]}>
              <Text style={[styles.verificationTagText, { color: '#10B981' }]}>
                ✓ VERIFIED
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.bioText, { color: colors.secondaryText }]}>
          Diseñador visual y Fotografía - Villahermosa, México
        </Text>
        <Text style={[styles.bioTags, { color: colors.accent }]}>
          #lifestyle #design #photography #urban #art
        </Text>
      </View>

      {/* 2. Stats Row */}
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

      {/* 3. Follow / Edit Action Button */}
      <TouchableOpacity
        onPress={onToggleFollow}
        activeOpacity={0.85}
        style={styles.actionBtnContainer}
      >
        <LinearGradient
          colors={isFollowing ? ['#353849', '#242634'] : colors.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.followButton}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 4. Story Highlights Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.highlightsContainer}
      >
        {highlights.map((highlight) => (
          <TouchableOpacity
            key={highlight.id}
            style={styles.highlightItem}
            onPress={() => onHighlightPress?.(highlight)}
            activeOpacity={0.8}
          >
            <View style={styles.highlightCircleWrapper}>
              <LinearGradient
                colors={highlight.gradient}
                style={styles.highlightRing}
              >
                <View
                  style={[
                    styles.highlightInner,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <LinearGradient
                    colors={highlight.gradient}
                    style={styles.highlightFill}
                  />
                </View>
              </LinearGradient>

              {highlight.isAdd && (
                <View style={[styles.highlightPlusBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                  <Feather name="plus" size={10} color="#FFFFFF" />
                </View>
              )}
            </View>
            <Text
              style={[styles.highlightTitle, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {highlight.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 5. Profile Tabs (Post, Etiquetas, IGTV) */}
      <View style={[styles.tabsRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'posts' && styles.tabItemActive]}
          onPress={() => onTabChange('posts')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'posts' ? colors.text : colors.secondaryText },
              activeTab === 'posts' && styles.tabTextActive,
            ]}
          >
            Post
          </Text>
          {activeTab === 'posts' && (
            <View style={[styles.tabUnderline, { backgroundColor: colors.text }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'tags' && styles.tabItemActive]}
          onPress={() => onTabChange('tags')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'tags' ? colors.text : colors.secondaryText },
              activeTab === 'tags' && styles.tabTextActive,
            ]}
          >
            Etiquetas
          </Text>
          {activeTab === 'tags' && (
            <View style={[styles.tabUnderline, { backgroundColor: colors.text }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'igtv' && styles.tabItemActive]}
          onPress={() => onTabChange('igtv')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'igtv' ? colors.text : colors.secondaryText },
              activeTab === 'igtv' && styles.tabTextActive,
            ]}
          >
            IGTV
          </Text>
          {activeTab === 'igtv' && (
            <View style={[styles.tabUnderline, { backgroundColor: colors.text }]} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 3,
    marginBottom: 14,
  },
  avatarGap: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
    padding: 3,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 39,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  identityCard: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 8,
  },
  identityIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  identityBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  identityBadgeValue: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  badgeSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankTag: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  verificationTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bioText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bioTags: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 36,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  actionBtnContainer: {
    paddingHorizontal: 36,
    marginBottom: 20,
  },
  followButton: {
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF0A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  highlightsContainer: {
    paddingHorizontal: 18,
    gap: 14,
    marginBottom: 20,
  },
  highlightItem: {
    alignItems: 'center',
    width: 64,
  },
  highlightCircleWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  highlightRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
  },
  highlightInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    padding: 2,
  },
  highlightFill: {
    flex: 1,
    borderRadius: 26,
  },
  highlightPlusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabItemActive: {},
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '40%',
    borderRadius: 1,
  },
});
