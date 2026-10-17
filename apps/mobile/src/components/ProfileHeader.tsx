import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import { HighlightItem } from '../types';

interface ProfileHeaderProps {
  colors: ThemeColors;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  activeTab: 'posts' | 'tags' | 'igtv';
  onTabChange: (tab: 'posts' | 'tags' | 'igtv') => void;
  highlights: HighlightItem[];
  onHighlightPress?: (item: HighlightItem) => void;
  displayName?: string;
  email?: string;
  bio?: string;
  shadowRank?: string;
  verificationStatus?: string;
  shadowId?: string;
  onLogout?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  colors,
  isFollowing = false,
  onToggleFollow,
  activeTab,
  onTabChange,
  highlights,
  onHighlightPress,
  displayName,
  email,
  bio,
  shadowRank,
  verificationStatus,
  shadowId,
  onLogout,
}) => {
  const name = displayName || 'Mauricio Lopez';
  const bioContent = bio || 'Diseñador visual y Fotografía - Campus Community';

  return (
    <View style={styles.container}>
      {/* 1. Large Profile Avatar & User Details */}
      <View style={styles.avatarSection}>
        <LinearGradient
          colors={colors.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarRing}
        >
          <View style={[styles.avatarGap, { backgroundColor: colors.background }]}>
            <LinearGradient
              colors={['#FF0A78', '#7928CA', '#4338CA']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>
                {name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        <Text style={[styles.displayName, { color: colors.text }]}>
          {name}
        </Text>
        {email && (
          <Text style={[styles.emailText, { color: colors.accent }]}>
            {email}
          </Text>
        )}
        <Text style={[styles.bioText, { color: colors.secondaryText }]}>
          {bioContent}
        </Text>

        {/* Real Shadow Identity Badges if available */}
        {(shadowRank || shadowId) && (
          <View style={[styles.identityCard, { backgroundColor: colors.elevatedSurface, borderColor: colors.border }]}>
            {shadowId && (
              <View style={styles.identityIdRow}>
                <Text style={[styles.identityBadgeLabel, { color: colors.secondaryText }]}>
                  SHADOW ID:
                </Text>
                <Text style={[styles.identityBadgeValue, { color: colors.text }]}>
                  {shadowId.slice(0, 14)}
                </Text>
              </View>
            )}
            {shadowRank && (
              <LinearGradient
                colors={
                  shadowRank === 'KNIGHT'
                    ? ['rgba(168, 85, 247, 0.28)', 'rgba(79, 70, 229, 0.22)', 'rgba(6, 182, 212, 0.16)']
                    : ['rgba(255, 10, 120, 0.22)', 'rgba(153, 27, 234, 0.16)', 'rgba(79, 70, 229, 0.12)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.premiumPawnBadge,
                  { borderColor: shadowRank === 'KNIGHT' ? 'rgba(168, 85, 247, 0.55)' : 'rgba(255, 10, 120, 0.45)' },
                ]}
              >
                <View
                  style={[
                    styles.pawnEmblemCircle,
                    shadowRank === 'KNIGHT' && {
                      backgroundColor: 'rgba(168, 85, 247, 0.25)',
                      borderColor: 'rgba(6, 182, 212, 0.5)',
                    },
                  ]}
                >
                  <Text style={[styles.pawnEmblemSymbol, shadowRank === 'KNIGHT' && { color: '#06B6D4' }]}>
                    {shadowRank === 'KNIGHT' ? '♘' : '♙'}
                  </Text>
                </View>
                <View style={styles.pawnTextColumn}>
                  <View style={styles.pawnRankTitleRow}>
                    <Text style={[styles.pawnRankTitle, { color: colors.text }]}>
                      {shadowRank === 'KNIGHT' ? 'KNIGHT' : 'PAWN'}
                    </Text>
                    <View
                      style={[
                        styles.pawnTierPill,
                        shadowRank === 'KNIGHT' && {
                          backgroundColor: 'rgba(168, 85, 247, 0.3)',
                          borderColor: 'rgba(6, 182, 212, 0.45)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pawnTierPillText,
                          shadowRank === 'KNIGHT' && { color: '#38BDF8' },
                        ]}
                      >
                        {shadowRank === 'KNIGHT' ? 'RANK II' : 'RANK I'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.pawnSubtitle, { color: colors.secondaryText }]}>
                    {shadowRank === 'KNIGHT' ? 'Vanguard Status · Tier 02' : 'Foundation Status · Tier 01'}
                  </Text>
                </View>
              </LinearGradient>
            )}
            <View style={styles.badgeSubRow}>
              <View style={styles.authorityRow}>
                <Text style={[styles.authorityLabel, { color: colors.secondaryText }]}>Authority: </Text>
                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 10 }}>Backend</Text>
              </View>
              {verificationStatus && (
                <View
                  style={[
                    styles.verificationTag,
                    {
                      backgroundColor: verificationStatus === 'VERIFIED' ? '#10B98120' : '#F59E0B20',
                      borderColor: verificationStatus === 'VERIFIED' ? '#10B98150' : '#F59E0B50',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.verificationTagText,
                      { color: verificationStatus === 'VERIFIED' ? '#10B981' : '#F59E0B' },
                    ]}
                  >
                    {verificationStatus === 'VERIFIED' ? '✓ VERIFIED' : '⚠ UNVERIFIED'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* 2. Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>posts</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>248</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>seguidores</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>186</Text>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>seguidos</Text>
        </View>
      </View>

      {/* 3. Action Buttons Row: Follow / Edit & Real Logout */}
      <View style={styles.actionRowContainer}>
        {onToggleFollow && (
          <TouchableOpacity
            onPress={onToggleFollow}
            activeOpacity={0.85}
            style={styles.actionBtnFlex}
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
        )}

        {onLogout && (
          <TouchableOpacity
            onPress={onLogout}
            activeOpacity={0.7}
            style={[styles.logoutButton, { borderColor: colors.border, backgroundColor: colors.elevatedSurface }]}
          >
            <Feather name="log-out" size={16} color={colors.heartRed} />
            <Text style={[styles.logoutButtonText, { color: colors.heartRed }]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 4. Story Highlights Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.highlightsContainer}
      >
        {highlights.map((highlight) => (
          <TouchableOpacity
            key={highlight.id}
            onPress={() => onHighlightPress?.(highlight)}
            activeOpacity={0.8}
            style={styles.highlightItem}
          >
            <LinearGradient
              colors={highlight.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.highlightRing}
            >
              <View style={[styles.highlightInner, { backgroundColor: colors.background }]}>
                {highlight.isAdd ? (
                  <Feather name="plus" size={18} color={colors.text} />
                ) : (
                  <LinearGradient
                    colors={highlight.gradient}
                    style={styles.highlightAvatar}
                  />
                )}
              </View>
            </LinearGradient>
            <Text
              style={[styles.highlightTitle, { color: colors.secondaryText }]}
              numberOfLines={1}
            >
              {highlight.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 5. Navigation Tab Pills */}
      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'posts' && styles.tabItemActive]}
          onPress={() => onTabChange('posts')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="grid-outline"
            size={22}
            color={activeTab === 'posts' ? colors.accent : colors.secondaryText}
          />
          {activeTab === 'posts' && (
            <View style={[styles.activeUnderline, { backgroundColor: colors.accent }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'igtv' && styles.tabItemActive]}
          onPress={() => onTabChange('igtv')}
          activeOpacity={0.7}
        >
          <Feather
            name="tv"
            size={22}
            color={activeTab === 'igtv' ? colors.accent : colors.secondaryText}
          />
          {activeTab === 'igtv' && (
            <View style={[styles.activeUnderline, { backgroundColor: colors.accent }]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'tags' && styles.tabItemActive]}
          onPress={() => onTabChange('tags')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={activeTab === 'tags' ? colors.accent : colors.secondaryText}
          />
          {activeTab === 'tags' && (
            <View style={[styles.activeUnderline, { backgroundColor: colors.accent }]} />
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
    paddingHorizontal: 20,
  },
  avatarRing: {
    width: 86,
    height: 86,
    borderRadius: 24,
    padding: 2.5,
    marginBottom: 12,
  },
  avatarGap: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
    padding: 2.5,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  emailText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  identityCard: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
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
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  premiumPawnBadge: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  pawnEmblemCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 10, 120, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 10, 120, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawnEmblemSymbol: {
    fontSize: 22,
    color: '#FF0A78',
  },
  pawnTextColumn: {
    flex: 1,
  },
  pawnRankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pawnRankTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  pawnTierPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 10, 120, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 10, 120, 0.45)',
  },
  pawnTierPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF77B8',
    letterSpacing: 0.5,
  },
  pawnSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  authorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorityLabel: {
    fontSize: 10,
    fontWeight: '500',
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginTop: 18,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  actionRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 22,
  },
  actionBtnFlex: {
    flex: 1,
  },
  followButton: {
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF0A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  highlightsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
  },
  highlightItem: {
    alignItems: 'center',
    width: 64,
  },
  highlightRing: {
    width: 58,
    height: 58,
    borderRadius: 16,
    padding: 2,
    marginBottom: 6,
  },
  highlightInner: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  highlightTitle: {
    fontSize: 11,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    height: 46,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabItemActive: {},
  activeUnderline: {
    position: 'absolute',
    bottom: -1,
    width: 32,
    height: 2,
    borderRadius: 1,
  },
});
