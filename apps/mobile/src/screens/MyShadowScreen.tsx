import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';

interface MyShadowScreenProps {
  onBack?: () => void;
  navigation?: any;
}

export default function MyShadowScreen({ onBack, navigation }: MyShadowScreenProps) {
  const { colors, isDark } = useTheme();
  const { identity } = useSession();

  const [activeTab, setActiveTab] = useState<'overview' | 'reputation' | 'monetization' | 'hardware'>('overview');
  const [monetizationEnabled, setMonetizationEnabled] = useState(true);
  const [publicVisibility, setPublicVisibility] = useState(true);
  const [privacyShield, setPrivacyShield] = useState(false);

  const shadowId = identity?.shadow?.id || 'shdw_mlopez89';
  const displayName = identity?.name || 'Mauricio Lopez';
  const username = identity?.profile?.bio ? 'maoo.lopez' : 'maoo.lopez';
  const rank = identity?.shadowRank?.rankType || 'PAWN';
  const isVerified = identity?.verification?.status === 'VERIFIED';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleCopyId = () => {
    Alert.alert('Shadow ID', `Identificador: ${shadowId}`);
  };

  const TIERS = [
    { rank: 'PAWN', level: 'Rank I', status: 'Foundation Status', isCurrent: rank === 'PAWN', symbol: '♙' },
    { rank: 'KNIGHT', level: 'Rank II', status: 'Vanguard Status', isCurrent: rank === 'KNIGHT', symbol: '♘' },
    { rank: 'BISHOP', level: 'Rank III', status: 'Strategic Status', isCurrent: false, symbol: '♗' },
    { rank: 'ROOK', level: 'Rank IV', status: 'Fortress Status', isCurrent: false, symbol: '♖' },
    { rank: 'QUEEN', level: 'Rank V', status: 'Sovereign Status', isCurrent: false, symbol: '♕' },
    { rank: 'KING', level: 'Rank VI', status: 'Apex Status', isCurrent: false, symbol: '♔' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ======================================================== */}
      {/* A. HEADER                                                */}
      {/* ======================================================== */}
      <View style={[styles.header, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.headerBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Shadow</Text>
          <View style={styles.hubBadge}>
            <Text style={styles.hubBadgeText}>HUB</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleCopyId} style={[styles.idCopyBtn, { borderColor: colors.border }]} activeOpacity={0.7}>
          <Text style={styles.idCopyText}>ID</Text>
          <Feather name="copy" size={12} color={colors.secondaryText} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* ======================================================== */}
        {/* B. HERO SECTION — SHADOW IDENTITY                        */}
        {/* ======================================================== */}
        <LinearGradient
          colors={
            isDark
              ? ['#181A2E', '#121424', '#0D0F1B']
              : ['#FFFFFF', '#F8FAFC', '#F1F5F9']
          }
          style={[styles.heroCard, { borderColor: colors.border }]}
        >
          {/* Cyber Aura Avatar Container */}
          <LinearGradient
            colors={colors.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroAuraRing}
          >
            <View style={[styles.heroAuraInner, { backgroundColor: colors.background }]}>
              <Text style={styles.heroGlyphText}>♙</Text>
            </View>
            <View style={styles.verifiedFloatingPill}>
              <MaterialCommunityIcons
                name={isVerified ? 'shield-check' : 'shield-alert'}
                size={14}
                color={isVerified ? '#10B981' : '#F59E0B'}
              />
            </View>
          </LinearGradient>

          <Text style={[styles.heroName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.heroUsername, { color: colors.secondaryText }]}>@{username}</Text>

          {/* Shadow ID Pill */}
          <TouchableOpacity onPress={handleCopyId} style={styles.shadowIdPill} activeOpacity={0.8}>
            <Text style={styles.shadowIdLabel}>SHADOW ID</Text>
            <Text style={[styles.shadowIdValue, { color: colors.text }]}>{shadowId}</Text>
            <Feather name="copy" size={11} color={colors.secondaryText} />
          </TouchableOpacity>

          {/* Rank Badge Indicator */}
          <LinearGradient
            colors={['rgba(255, 10, 120, 0.22)', 'rgba(153, 27, 234, 0.16)']}
            style={[styles.heroRankBadge, { borderColor: 'rgba(255, 10, 120, 0.45)' }]}
          >
            <View style={styles.heroRankBadgeIcon}>
              <Text style={{ fontSize: 16, color: '#FF0A78' }}>♙</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.heroRankTitle, { color: colors.text }]}>{rank}</Text>
                <View style={styles.tierPill}>
                  <Text style={styles.tierPillText}>RANK I</Text>
                </View>
              </View>
              <Text style={[styles.heroRankSubtitle, { color: colors.secondaryText }]}>
                Foundation Status · Tier 01 Baseline
              </Text>
            </View>
          </LinearGradient>
        </LinearGradient>

        {/* Navigation Filter Tabs */}
        <View style={[styles.tabBarWrap, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          {(
            [
              { key: 'overview', label: 'Evolución' },
              { key: 'reputation', label: 'Reputación' },
              { key: 'monetization', label: 'Ganancias' },
              { key: 'hardware', label: 'Hardware' },
            ] as const
          ).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabBarItem,
                activeTab === tab.key && {
                  backgroundColor: colors.accent,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabBarItemText,
                  { color: activeTab === tab.key ? '#FFFFFF' : colors.secondaryText },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ======================================================== */}
        {/* C & E. CURRENT RANK & EVOLUTION PROGRESS                 */}
        {/* ======================================================== */}
        {(activeTab === 'overview' || activeTab === 'reputation') && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Feather name="trending-up" size={16} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Shadow Evolution</Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.secondaryText }]}>Jerarquía: PAWN → KING</Text>
            </View>

            <View style={styles.stepperContainer}>
              {TIERS.map((tier) => (
                <View
                  key={tier.rank}
                  style={[
                    styles.stepperItem,
                    tier.isCurrent && [styles.stepperItemActive, { borderColor: colors.accent }],
                    { backgroundColor: tier.isCurrent ? 'rgba(255, 10, 120, 0.12)' : colors.inputBackground },
                  ]}
                >
                  <View style={styles.stepperItemLeft}>
                    <Text style={styles.tierSymbol}>{tier.symbol}</Text>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.tierRank, { color: colors.text }]}>{tier.rank}</Text>
                        <Text style={[styles.tierLevel, { color: colors.secondaryText }]}>{tier.level}</Text>
                      </View>
                      <Text style={[styles.tierStatus, { color: colors.secondaryText }]}>{tier.status}</Text>
                    </View>
                  </View>

                  {tier.isCurrent ? (
                    <View style={[styles.activePill, { backgroundColor: colors.accent }]}>
                      <Text style={styles.activePillText}>ACTIVO</Text>
                    </View>
                  ) : (
                    <Feather name="lock" size={13} color={colors.secondaryText} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* D. REPUTATION / SHADOW STATUS                            */}
        {/* ======================================================== */}
        {(activeTab === 'overview' || activeTab === 'reputation') && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialCommunityIcons name="shield-star" size={17} color="#06B6D4" />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Estado de Reputación</Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.secondaryText }]}>Marco de Confianza Protocolar</Text>
            </View>

            <View style={styles.gridContainer}>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>ESTADO</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>Tier 01 (Foundation)</Text>
              </View>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>AUTORIDAD</Text>
                <Text style={[styles.gridValue, { color: colors.accent }]}>Backend Controlled</Text>
              </View>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>VERIFICACIÓN</Text>
                <Text style={[styles.gridValue, { color: '#10B981' }]}>Activo · Genesis</Text>
              </View>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>NODO ANCLA</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>Sincronizado</Text>
              </View>
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* G & H. EARNINGS & CAMPAIGNS                              */}
        {/* ======================================================== */}
        {(activeTab === 'overview' || activeTab === 'monetization') && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Feather name="dollar-sign" size={16} color="#10B981" />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Monetización y Campañas</Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.secondaryText }]}>Espacio para futura economía Shadow</Text>
            </View>

            <View style={styles.gridContainer}>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>ESTIMADO</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>— —</Text>
              </View>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>PENDIENTE</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>— —</Text>
              </View>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>DISPONIBLE</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>— —</Text>
              </View>
              <View style={[styles.gridCell, { backgroundColor: colors.inputBackground }]}>
                <Text style={styles.gridLabel}>CAMPAÑAS ACTIVAS</Text>
                <Text style={[styles.gridValue, { color: colors.secondaryText }]}>0 Disponibles</Text>
              </View>
            </View>

            <Text style={[styles.disclaimerText, { color: colors.secondaryText }]}>
              Los cálculos de monetización, liquidaciones y patrocinios comerciales se integrarán en una fase posterior.
            </Text>
          </View>
        )}

        {/* ======================================================== */}
        {/* I & J. CONTROLS & HARDWARE                               */}
        {/* ======================================================== */}
        {(activeTab === 'overview' || activeTab === 'hardware') && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Feather name="cpu" size={16} color="#38BDF8" />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Hardware y Gobernanza</Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.secondaryText }]}>Nodos físicos y privacidad digital</Text>
            </View>

            {/* Switch 1: Monetización */}
            <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Participación en Monetización</Text>
                <Text style={[styles.toggleDesc, { color: colors.secondaryText }]}>Habilitar elegibilidad para futuras recompensas.</Text>
              </View>
              <Switch
                value={monetizationEnabled}
                onValueChange={setMonetizationEnabled}
                trackColor={{ false: '#4B5563', true: colors.accent }}
              />
            </View>

            {/* Switch 2: Visibilidad Pública */}
            <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Perfil Shadow Público</Text>
                <Text style={[styles.toggleDesc, { color: colors.secondaryText }]}>Visible para otros miembros de la red.</Text>
              </View>
              <Switch
                value={publicVisibility}
                onValueChange={setPublicVisibility}
                trackColor={{ false: '#4B5563', true: colors.accent }}
              />
            </View>

            {/* Switch 3: Escudo Telemetría */}
            <View style={styles.toggleRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Escudo de Telemetría</Text>
                <Text style={[styles.toggleDesc, { color: colors.secondaryText }]}>Ofuscación de telemetría de uso.</Text>
              </View>
              <Switch
                value={privacyShield}
                onValueChange={setPrivacyShield}
                trackColor={{ false: '#4B5563', true: colors.accent }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  hubBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 10, 120, 0.2)',
  },
  hubBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF0A78',
  },
  idCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  idCopyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF0A78',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  heroAuraRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 3,
    marginBottom: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAuraInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlyphText: {
    fontSize: 34,
    color: '#FF0A78',
  },
  verifiedFloatingPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0B0C14',
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroUsername: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  shadowIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  shadowIdLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF0A78',
  },
  shadowIdValue: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  heroRankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    width: '100%',
    gap: 10,
  },
  heroRankBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 10, 120, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRankTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tierPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 10, 120, 0.3)',
  },
  tierPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF0A78',
  },
  heroRankSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  tabBarWrap: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
  },
  tabBarItem: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarItemText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  stepperContainer: {
    gap: 6,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
  },
  stepperItemActive: {
    borderWidth: 1,
  },
  stepperItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tierSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF0A78',
    width: 22,
    textAlign: 'center',
  },
  tierRank: {
    fontSize: 12,
    fontWeight: '800',
  },
  tierLevel: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  tierStatus: {
    fontSize: 10,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCell: {
    flex: 1,
    minWidth: '45%',
    padding: 10,
    borderRadius: 12,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  disclaimerText: {
    fontSize: 10,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleDesc: {
    fontSize: 10,
    marginTop: 2,
    lineHeight: 13,
  },
});
