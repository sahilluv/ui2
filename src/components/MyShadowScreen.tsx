import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  Copy,
  ShieldCheck,
  Heart,
  Flame,
  Globe,
  Users,
  Search,
  MoreVertical,
  Trophy,
  ArrowRight,
  UserPlus,
  UserCheck,
  Sparkles,
  RefreshCw,
  Crown,
  Sun,
  Moon,
  Radio,
} from 'lucide-react';
import {
  PawnRankBadge,
  ShadowRankType,
  PremiumPawnInsignia,
  PremiumKnightInsignia,
  getRankMeta,
  triggerRankConfetti,
  playRankElevationChime,
} from './PawnRankBadge';
import { getSemUiTokens, semUiPalette } from '../theme/semUiPalette';

export interface MyShadowScreenProps {
  onBack: () => void;
  isDark?: boolean;
  currentUser?: {
    name: string;
    username: string;
    shadowId: string;
    rank: ShadowRankType;
    isVerified: boolean;
    avatarGradient: string;
  };
  onToast: (msg: string, icon?: 'sparkles' | 'bookmark') => void;
}

export interface WorldRankedUser {
  rankPosition: number;
  id: string;
  name: string;
  username: string;
  shadowId: string;
  location: string;
  flag: string;
  avatarBg: string;
  avatarSymbol: string;
  isVerified: boolean;
  shadowRank: ShadowRankType;
  shadowStatus: string;
  tierLevel: string;
  reputation: number;
  streakDays: number;
  nodesActive: number;
  cheerCount: number;
  hasCheered: boolean;
  isFollowing: boolean;
  statusQuote: string;
}

export interface RankUpgradePerson {
  id: string;
  name: string;
  username: string;
  location: string;
  flag: string;
  avatarBg: string;
  avatarSymbol: string;
  isVerified: boolean;
  fromRank: ShadowRankType;
  toRank: ShadowRankType;
  fromTier: string;
  toTier: string;
  streakDays: number;
  repGained: number;
  congratsCount: number;
  hasCongratulated: boolean;
  isFollowing: boolean;
  timeAgo: string;
  achievementSummary: string;
}

const INITIAL_WORLD_RANKINGS: WorldRankedUser[] = [
  {
    rankPosition: 1,
    id: 'wr_1',
    name: 'David Chen',
    username: 'dchen.ai',
    shadowId: 'shdw_dchen01',
    location: 'Singapore',
    flag: '🇸🇬',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♔',
    isVerified: true,
    shadowRank: 'KING',
    shadowStatus: 'Apex Status',
    tierLevel: 'Rank VI',
    reputation: 34500,
    streakDays: 280,
    nodesActive: 128,
    cheerCount: 1250,
    hasCheered: false,
    isFollowing: false,
    statusQuote: 'Apex King of the genesis mesh. Orchestrating cross-continental consensus channels.',
  },
  {
    rankPosition: 2,
    id: 'wr_2',
    name: 'Sofia Lindqvist',
    username: 'sofia.design',
    shadowId: 'shdw_slind92',
    location: 'Stockholm, Sweden',
    flag: '🇸🇪',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♕',
    isVerified: true,
    shadowRank: 'QUEEN',
    shadowStatus: 'Sovereign Status',
    tierLevel: 'Rank V',
    reputation: 27800,
    streakDays: 194,
    nodesActive: 96,
    cheerCount: 890,
    hasCheered: true,
    isFollowing: false,
    statusQuote: 'Leading regional decentralization and high-dimensional interface synthesis.',
  },
  {
    rankPosition: 3,
    id: 'wr_3',
    name: 'Jin-Woo Park',
    username: 'jinwoo.core',
    shadowId: 'shdw_jpark88',
    location: 'Seoul, South Korea',
    flag: '🇰🇷',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♕',
    isVerified: true,
    shadowRank: 'QUEEN',
    shadowStatus: 'Sovereign Status',
    tierLevel: 'Rank V',
    reputation: 25400,
    streakDays: 165,
    nodesActive: 84,
    cheerCount: 740,
    hasCheered: false,
    isFollowing: false,
    statusQuote: 'Orchestrating high-throughput data sharding pipelines across 100 shadow nodes.',
  },
  {
    rankPosition: 4,
    id: 'wr_4',
    name: 'Marcus Vance',
    username: 'marcus.vance',
    shadowId: 'shdw_mvance44',
    location: 'San Francisco, USA',
    flag: '🇺🇸',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♖',
    isVerified: true,
    shadowRank: 'ROOK',
    shadowStatus: 'Fortress Status',
    tierLevel: 'Rank IV',
    reputation: 19200,
    streakDays: 112,
    nodesActive: 64,
    cheerCount: 520,
    hasCheered: false,
    isFollowing: false,
    statusQuote: 'Established Fortress Node authority. Processed over 500,000 protocol attestations.',
  },
  {
    rankPosition: 5,
    id: 'wr_5',
    name: 'Zara Al-Mansoor',
    username: 'zara.am',
    shadowId: 'shdw_zalm33',
    location: 'Dubai, UAE',
    flag: '🇦🇪',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♖',
    isVerified: true,
    shadowRank: 'ROOK',
    shadowStatus: 'Fortress Status',
    tierLevel: 'Rank IV',
    reputation: 18100,
    streakDays: 98,
    nodesActive: 58,
    cheerCount: 460,
    hasCheered: true,
    isFollowing: true,
    statusQuote: 'Deployed multi-region consensus relayer and unlocked prime Fortress status.',
  },
  {
    rankPosition: 6,
    id: 'wr_6',
    name: 'Hannes Meyer',
    username: 'hannes.vibe',
    shadowId: 'shdw_hmeyer23',
    location: 'Berlin, Germany',
    flag: '🇩🇪',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♖',
    isVerified: true,
    shadowRank: 'ROOK',
    shadowStatus: 'Fortress Status',
    tierLevel: 'Rank IV',
    reputation: 15200,
    streakDays: 105,
    nodesActive: 48,
    cheerCount: 395,
    hasCheered: false,
    isFollowing: false,
    statusQuote: 'Validated Central Europe node cluster with 99.98% uptime in zero-knowledge relay trials.',
  },
  {
    rankPosition: 7,
    id: 'wr_7',
    name: 'Kenji Sato',
    username: 'kenji.sato',
    shadowId: 'shdw_ksato77',
    location: 'Kyoto, Japan',
    flag: '🇯🇵',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♗',
    isVerified: true,
    shadowRank: 'BISHOP',
    shadowStatus: 'Strategic Status',
    tierLevel: 'Rank III',
    reputation: 14300,
    streakDays: 76,
    nodesActive: 42,
    cheerCount: 380,
    hasCheered: true,
    isFollowing: true,
    statusQuote: 'Authored 14 protocol governance standards and strategic zero-knowledge relays.',
  },
  {
    rankPosition: 8,
    id: 'wr_8',
    name: 'Liam O’Connor',
    username: 'liam.eth',
    shadowId: 'shdw_locon12',
    location: 'Dublin, Ireland',
    flag: '🇮🇪',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♗',
    isVerified: true,
    shadowRank: 'BISHOP',
    shadowStatus: 'Strategic Status',
    tierLevel: 'Rank III',
    reputation: 13800,
    streakDays: 68,
    nodesActive: 38,
    cheerCount: 310,
    hasCheered: false,
    isFollowing: false,
    statusQuote: 'Published open source reputation auditor smart contract for the shadow mesh.',
  },
  {
    rankPosition: 9,
    id: 'wr_9',
    name: 'Mateo Fernandez',
    username: 'mateo.f',
    shadowId: 'shdw_mfern55',
    location: 'Barcelona, Spain',
    flag: '🇪🇸',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♗',
    isVerified: true,
    shadowRank: 'BISHOP',
    shadowStatus: 'Strategic Status',
    tierLevel: 'Rank III',
    reputation: 12900,
    streakDays: 55,
    nodesActive: 35,
    cheerCount: 290,
    hasCheered: false,
    isFollowing: false,
    statusQuote: 'European node validator group leader with over 5,000 peer affirmations.',
  },
  {
    rankPosition: 10,
    id: 'wr_10',
    name: 'Elena Rostova',
    username: 'elena.rostova',
    shadowId: 'shdw_erost81',
    location: 'Tokyo, Japan',
    flag: '🇯🇵',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♘',
    isVerified: true,
    shadowRank: 'KNIGHT',
    shadowStatus: 'Vanguard Status',
    tierLevel: 'Rank II',
    reputation: 9400,
    streakDays: 48,
    nodesActive: 24,
    cheerCount: 240,
    hasCheered: true,
    isFollowing: true,
    statusQuote: 'Vanguard node operator with 48 days of flawless telemetry synchronization.',
  },
  {
    rankPosition: 11,
    id: 'wr_11',
    name: 'Chloe Dubois',
    username: 'chloe.shadow',
    shadowId: 'shdw_cdub67',
    location: 'Paris, France',
    flag: '🇫🇷',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♘',
    isVerified: true,
    shadowRank: 'KNIGHT',
    shadowStatus: 'Vanguard Status',
    tierLevel: 'Rank II',
    reputation: 8900,
    streakDays: 42,
    nodesActive: 22,
    cheerCount: 215,
    hasCheered: true,
    isFollowing: true,
    statusQuote: 'Certified Vanguard node operator with zero dispute history across Paris nodes.',
  },
  {
    rankPosition: 12,
    id: 'wr_12',
    name: 'Amara Okafor',
    username: 'amara.okafor',
    shadowId: 'shdw_aokafor55',
    location: 'Lagos, Nigeria',
    flag: '🇳🇬',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♘',
    isVerified: true,
    shadowRank: 'KNIGHT',
    shadowStatus: 'Vanguard Status',
    tierLevel: 'Rank II',
    reputation: 7800,
    streakDays: 35,
    nodesActive: 18,
    cheerCount: 185,
    hasCheered: false,
    isFollowing: true,
    statusQuote: 'Mastered peer validation protocol and earned community endorsement across African nodes.',
  },
];

const INITIAL_UPGRADES: RankUpgradePerson[] = [
  {
    id: 'upg_1',
    name: 'Elena Rostova',
    username: 'elena.rostova',
    location: 'Tokyo, Japan',
    flag: '🇯🇵',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♘',
    isVerified: true,
    fromRank: 'PAWN',
    toRank: 'KNIGHT',
    fromTier: 'Rank I',
    toTier: 'Rank II',
    streakDays: 48,
    repGained: 450,
    congratsCount: 142,
    hasCongratulated: false,
    isFollowing: true,
    timeAgo: '2m ago',
    achievementSummary: 'Completed Vanguard Trial and 48 consecutive days of cryptographic verification.',
  },
  {
    id: 'upg_2',
    name: 'Kenji Sato',
    username: 'kenji.sato',
    location: 'Kyoto, Japan',
    flag: '🇯🇵',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♗',
    isVerified: true,
    fromRank: 'KNIGHT',
    toRank: 'BISHOP',
    fromTier: 'Rank II',
    toTier: 'Rank III',
    streakDays: 76,
    repGained: 850,
    congratsCount: 231,
    hasCongratulated: true,
    isFollowing: true,
    timeAgo: '14m ago',
    achievementSummary: 'Authored 12 protocol governance proposals and reached strategic consensus threshold.',
  },
  {
    id: 'upg_3',
    name: 'Marcus Vance',
    username: 'marcus.vance',
    location: 'San Francisco, USA',
    flag: '🇺🇸',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♖',
    isVerified: true,
    fromRank: 'BISHOP',
    toRank: 'ROOK',
    fromTier: 'Rank III',
    toTier: 'Rank IV',
    streakDays: 112,
    repGained: 1500,
    congratsCount: 389,
    hasCongratulated: false,
    isFollowing: false,
    timeAgo: '35m ago',
    achievementSummary: 'Established Fortress Node authority and processed over 500,000 protocol blocks.',
  },
  {
    id: 'upg_4',
    name: 'Amara Okafor',
    username: 'amara.okafor',
    location: 'Lagos, Nigeria',
    flag: '🇳🇬',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♘',
    isVerified: true,
    fromRank: 'PAWN',
    toRank: 'KNIGHT',
    fromTier: 'Rank I',
    toTier: 'Rank II',
    streakDays: 35,
    repGained: 450,
    congratsCount: 89,
    hasCongratulated: false,
    isFollowing: true,
    timeAgo: '1h ago',
    achievementSummary: 'Mastered peer validation protocol and earned community endorsement across African nodes.',
  },
  {
    id: 'upg_5',
    name: 'Sofia Lindqvist',
    username: 'sofia.design',
    location: 'Stockholm, Sweden',
    flag: '🇸🇪',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♕',
    isVerified: true,
    fromRank: 'ROOK',
    toRank: 'QUEEN',
    fromTier: 'Rank IV',
    toTier: 'Rank V',
    streakDays: 194,
    repGained: 3200,
    congratsCount: 612,
    hasCongratulated: false,
    isFollowing: false,
    timeAgo: '2h ago',
    achievementSummary: 'Ascended to Sovereign status after leading Nordic regional decentralization initiative.',
  },
  {
    id: 'upg_6',
    name: 'David Chen',
    username: 'dchen.ai',
    location: 'Singapore',
    flag: '🇸🇬',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♔',
    isVerified: true,
    fromRank: 'QUEEN',
    toRank: 'KING',
    fromTier: 'Rank V',
    toTier: 'Rank VI',
    streakDays: 280,
    repGained: 6500,
    congratsCount: 1250,
    hasCongratulated: false,
    isFollowing: true,
    timeAgo: '3h ago',
    achievementSummary: 'Apex King of the genesis mesh. Orchestrated cross-continental consensus channels.',
  },
  {
    id: 'upg_7',
    name: 'Chloe Dubois',
    username: 'chloe.shadow',
    location: 'Paris, France',
    flag: '🇫🇷',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♘',
    isVerified: true,
    fromRank: 'PAWN',
    toRank: 'KNIGHT',
    fromTier: 'Rank I',
    toTier: 'Rank II',
    streakDays: 42,
    repGained: 450,
    congratsCount: 167,
    hasCongratulated: false,
    isFollowing: false,
    timeAgo: '4h ago',
    achievementSummary: 'Certified Vanguard node operator with flawless telemetry synchronization record.',
  },
  {
    id: 'upg_8',
    name: 'Zara Al-Mansoor',
    username: 'zara.am',
    location: 'Dubai, UAE',
    flag: '🇦🇪',
    avatarBg: '#1A1A1A',
    avatarSymbol: '♖',
    isVerified: true,
    fromRank: 'BISHOP',
    toRank: 'ROOK',
    fromTier: 'Rank III',
    toTier: 'Rank IV',
    streakDays: 98,
    repGained: 1650,
    congratsCount: 460,
    hasCongratulated: true,
    isFollowing: true,
    timeAgo: '5h ago',
    achievementSummary: 'Deployed multi-region consensus relayer and unlocked prime Fortress status.',
  },
];

export const MyShadowScreen: React.FC<MyShadowScreenProps> = ({
  onBack,
  isDark = false,
  currentUser = {
    name: 'Mauricio Lopez',
    username: 'maoo.lopez',
    shadowId: 'shdw_mlopez89',
    rank: 'PAWN',
    isVerified: true,
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
  },
  onToast,
}) => {
  // Sem UI Theme Settings (Strictly adheres to Sem UI dark/light tokens with WCAG AA compliance)
  const [internalDark, setInternalDark] = useState<boolean | null>(null);
  const isDarkTheme = internalDark !== null ? internalDark : !!isDark;
  const semTokens = getSemUiTokens(isDarkTheme);

  // Navigation Tabs: 'rankings' (👑 World Rankings) | 'world' (World Upgrades) | 'following' | 'all'
  const [activeMainTab, setActiveMainTab] = useState<'rankings' | 'world' | 'following' | 'all'>('rankings');

  // World Rankings state
  const [worldRankings, setWorldRankings] = useState<WorldRankedUser[]>(INITIAL_WORLD_RANKINGS);
  const [isFetchingRankings, setIsFetchingRankings] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  // Live Upgrades state
  const [upgrades, setUpgrades] = useState<RankUpgradePerson[]>(INITIAL_UPGRADES);

  // Local simulated rank for Mauricio (PAWN ↔ KNIGHT)
  const [localRank, setLocalRank] = useState<ShadowRankType>(currentUser.rank || 'PAWN');
  const [isPromoting, setIsPromoting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');

  // Asynchronous Fetch & Consensus Sync
  const fetchWorldRankings = (silent: boolean = false) => {
    setIsFetchingRankings(true);
    setTimeout(() => {
      setWorldRankings((prev) =>
        prev.map((user) => ({
          ...user,
          reputation: user.reputation + Math.floor(Math.random() * 25),
        }))
      );
      setIsFetchingRankings(false);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (!silent) {
        onToast('Consensus state synchronized with decentralized nodes!', 'sparkles');
      }
    }, 450);
  };

  useEffect(() => {
    fetchWorldRankings(true);
  }, []);

  // Copy Shadow ID
  const handleCopyId = (idToCopy: string = currentUser.shadowId) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(idToCopy);
      }
    } catch {
      // Fallback
    }
    onToast(`Shadow ID copied: ${idToCopy}`, 'sparkles');
  };

  // Toggle simulated rank promotion (PAWN ↔ KNIGHT)
  const handleTogglePromote = (e?: React.MouseEvent) => {
    if (isPromoting) return;
    setIsPromoting(true);
    const nextRank: ShadowRankType = localRank === 'PAWN' ? 'KNIGHT' : 'PAWN';

    // Calculate origin coordinates from click event for precise confetti burst
    let origin: { x: number; y: number } | undefined;
    if (e && typeof window !== 'undefined') {
      origin = {
        x: Math.min(Math.max(e.clientX / window.innerWidth, 0.1), 0.9),
        y: Math.min(Math.max(e.clientY / window.innerHeight, 0.1), 0.9),
      };
    }

    // Play harmonious Web Audio chime and launch celebratory confetti
    playRankElevationChime(nextRank === 'KNIGHT');
    triggerRankConfetti(nextRank, origin);

    // Apply next rank immediately so animations spring from the new tier
    setLocalRank(nextRank);
    onToast(
      nextRank === 'KNIGHT'
        ? '✦ Promoted to KNIGHT (Vanguard Status)'
        : '✦ Reverted to PAWN (Foundation Status)',
      'sparkles'
    );

    setTimeout(() => {
      setIsPromoting(false);
    }, 1200);
  };

  // Cheer / Heart reaction on World Ranking Cards
  const handleToggleCheerRanking = (id: string) => {
    setWorldRankings((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const nextState = !user.hasCheered;
          const nextCount = nextState ? user.cheerCount + 1 : Math.max(0, user.cheerCount - 1);
          if (nextState) {
            onToast(`Cheered for #${user.rankPosition} @${user.username}! ❤️`, 'sparkles');
          }
          return {
            ...user,
            hasCheered: nextState,
            cheerCount: nextCount,
          };
        }
        return user;
      })
    );
  };

  // Follow / Unfollow on World Rankings
  const handleToggleFollowRanking = (id: string) => {
    setWorldRankings((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const nextFollowing = !user.isFollowing;
          onToast(nextFollowing ? `Following @${user.username}` : `Unfollowed @${user.username}`);
          return {
            ...user,
            isFollowing: nextFollowing,
          };
        }
        return user;
      })
    );
  };

  // Congratulate on Rank Upgrades Feed
  const handleToggleCongratulate = (id: string) => {
    setUpgrades((prev) =>
      prev.map((person) => {
        if (person.id === id) {
          const nextState = !person.hasCongratulated;
          const nextCount = nextState ? person.congratsCount + 1 : Math.max(0, person.congratsCount - 1);
          if (nextState) {
            onToast(`Congratulated @${person.username} on upgrading to ${person.toRank}! 🎉`, 'sparkles');
          }
          return {
            ...person,
            hasCongratulated: nextState,
            congratsCount: nextCount,
          };
        }
        return person;
      })
    );
  };

  // Follow / Unfollow on Upgrades Feed (dynamically syncs with Following tab)
  const handleToggleFollowUpgrade = (id: string) => {
    setUpgrades((prev) =>
      prev.map((person) => {
        if (person.id === id) {
          const nextFollowing = !person.isFollowing;
          onToast(nextFollowing ? `Now following @${person.username}` : `Unfollowed @${person.username}`);
          return {
            ...person,
            isFollowing: nextFollowing,
          };
        }
        return person;
      })
    );
  };

  // Filtered World Rankings
  const filteredRankings = useMemo(() => {
    return worldRankings.filter((user) => {
      if (filterTier !== 'ALL' && user.shadowRank !== filterTier) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesUsername = user.username.toLowerCase().includes(q);
        const matchesLocation = user.location.toLowerCase().includes(q);
        const matchesRank = user.shadowRank.toLowerCase().includes(q);
        const matchesId = user.shadowId.toLowerCase().includes(q);
        if (!matchesName && !matchesUsername && !matchesLocation && !matchesRank && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [worldRankings, searchQuery, filterTier]);

  // Filtered Upgrades
  const filteredUpgrades = useMemo(() => {
    return upgrades.filter((person) => {
      if (activeMainTab === 'following' && !person.isFollowing) {
        return false;
      }
      if (filterTier !== 'ALL' && person.toRank !== filterTier) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = person.name.toLowerCase().includes(q);
        const matchesUsername = person.username.toLowerCase().includes(q);
        const matchesLocation = person.location.toLowerCase().includes(q);
        const matchesRank = person.toRank.toLowerCase().includes(q) || person.fromRank.toLowerCase().includes(q);
        if (!matchesName && !matchesUsername && !matchesLocation && !matchesRank) {
          return false;
        }
      }
      return true;
    });
  }, [upgrades, activeMainTab, filterTier, searchQuery]);

  // Shadow highlights list with natural reference editorial tones
  const SHADOW_HIGHLIGHTS = [
    { id: 'streaks', label: 'Streaks 🔥', icon: '🔥', gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)' },
    { id: 'genesis', label: 'Genesis ♙', icon: '♙', gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)' },
    { id: 'ranks', label: 'Ranks ♘', icon: '♘', gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)' },
    { id: 'nodes', label: 'Nodes 🌐', icon: '🌐', gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)' },
    { id: 'badges', label: 'Badges 🏆', icon: '🏆', gradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)' },
  ];

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto no-scrollbar pb-32 transition-colors ${
        isDarkTheme ? 'bg-[#12131A] text-white' : 'bg-[#FFFFFF] text-[#1B1C1D]'
      }`}
    >
      {/* ======================================================== */}
      {/* 1. HEADER (Sem UI Calibrated Background & Rose Wordmark)  */}
      {/* ======================================================== */}
      <header
        className={`sticky top-0 z-30 h-13 px-4 flex items-center justify-between shrink-0 border-b transition-colors ${
          isDarkTheme
            ? 'bg-[#12131A]/95 border-white/10 text-white'
            : 'bg-[#FFFFFF]/95 border-[#E0E1E2] text-[#1B1C1D]'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-[#F2F3F5] text-[#1B1C1D]'
            }`}
            title="Return to Home Feed"
            aria-label="Back to Home Feed"
          >
            <ChevronLeft size={22} />
          </button>
        </div>

        {/* Center cursive script brand wordmark in signature purple (#7B52B9) */}
        <div className="flex items-center justify-center">
          <h1
            className="text-3xl font-shadow-script font-bold tracking-wide select-none cursor-pointer"
            style={{
              color: '#FFFFFF',
            }}
          >
            Shadow
          </h1>
        </div>

        {/* Right Action: Sync Consensus, Theme Toggle, & Options */}
        <div className="flex items-center gap-1">
          {/* Theme Mode Toggle (Synchronized Sem UI Dark / Light Palette) */}
          <button
            onClick={() => setInternalDark((prev) => (prev !== null ? !prev : !isDark))}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isDarkTheme ? 'hover:bg-white/10 text-yellow-300' : 'hover:bg-[#F2F3F5] text-[#767676]'
            }`}
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkTheme ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => fetchWorldRankings(false)}
            disabled={isFetchingRankings}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isDarkTheme ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-[#F2F3F5] text-[#1B1C1D]'
            }`}
            title="Sync Consensus State"
          >
            <RefreshCw
              size={15}
              className={`text-white ${isFetchingRankings ? 'animate-spin' : ''}`}
            />
          </button>

          <button
            onClick={() => onToast('Profile options', 'bookmark')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isDarkTheme ? 'hover:bg-white/10 text-white' : 'hover:bg-[#F2F3F5] text-[#1B1C1D]'
            }`}
            title="More options"
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="px-4 pt-3.5 space-y-4">
        {/* ======================================================== */}
        {/* 2. PROFILE SECTION (DIRECT REFERENCE MATCH)              */}
        {/* Circular Avatar on Left | Details & Exact Stats on Right */}
        {/* Pure White Surface + Clean Crisp Editorial Typography    */}
        {/* ======================================================== */}
        <div
          className={`p-4 rounded-[24px] border transition-all ${
            isDarkTheme
              ? 'bg-[#1A1B24] border-white/10 shadow-black/40'
              : 'bg-[#FFFFFF] border-[#E0E1E2] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Circular Avatar on Left (Matching Claire Green in reference) */}
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 rounded-full p-[2px] shadow-sm flex items-center justify-center ${
                  isDarkTheme ? 'ring-2 ring-white/30' : 'ring-2 ring-white/30'
                }`}
                style={{
                  background: isDarkTheme
                    ? 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)'
                    : 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                }}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden ${
                    isDarkTheme ? 'bg-[#12131A]' : 'bg-[#F7F8FA]'
                  }`}
                >
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: isDarkTheme
                        ? 'radial-gradient(circle at 35% 35%, #3B154C 0%, #171126 60%, #12131A 100%)'
                        : 'radial-gradient(circle at 35% 35%, #F4ECE1 0%, #E5D5C5 60%, #D8C3AE 100%)',
                    }}
                  >
                    {localRank === 'KNIGHT' ? (
                      <PremiumKnightInsignia size={38} glow={false} className={isDarkTheme ? 'text-white' : 'text-[#3E2723]'} />
                    ) : (
                      <PremiumPawnInsignia size={38} glow={false} className={isDarkTheme ? 'text-white' : 'text-[#3E2723]'} />
                    )}
                  </div>
                </div>
              </div>

              {/* Verified Shield Badge on Avatar Rim */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-sm"
                title="Cryptographically Verified Digital Persona"
              >
                <ShieldCheck size={13} className="fill-white/10 text-white" />
              </div>
            </div>

            {/* Right Column: Name, Handle & Exact Reference Stats Stack */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between">
                <h2 className={`text-base font-extrabold tracking-tight truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                  {currentUser.name}
                </h2>
              </div>
              <p className={`text-xs font-semibold truncate mt-0.5 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#767676]'}`}>
                @{currentUser.username}
              </p>

              {/* Clean Stats Stack Matching Sem UI Palette:
                  ❤️ 1.2k likes (Sem UI Red #DB2828)
                  🔥 48 streaks (Sem UI Orange #F2711C)
                  735 posts (#1B1C1D bold) */}
              <div className="flex items-center gap-4 mt-3">
                {/* 1. Post Count */}
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-extrabold ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                    735
                  </span>
                  <span className={`text-[11px] font-medium ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                    posts
                  </span>
                </div>

                {/* 2. Streaks Count (Replaces followers) */}
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-extrabold ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                    48
                  </span>
                  <span className={`text-[11px] font-medium flex items-center gap-0.5 ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                    streaks <Flame size={12} className="fill-neutral-300 text-neutral-300" />
                  </span>
                </div>

                {/* 3. Likes Count (Sem UI Red #DB2828) */}
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-extrabold ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                    1.2k
                  </span>
                  <span className={`text-[11px] font-medium flex items-center gap-0.5 ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                    likes <Heart size={11} className="fill-white text-white" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shadow ID Capsule, Rank Badge & Progression Control */}
          <div
            className={`mt-4 pt-3.5 border-t ${
              isDarkTheme ? 'border-white/10' : 'border-[#E0E1E2]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2.5">
              {/* Shadow ID Capsule with Click-to-Copy */}
              <button
                onClick={() => handleCopyId(currentUser.shadowId)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all cursor-pointer active:scale-95 ${
                  isDarkTheme
                    ? 'bg-white/5 border-white/10 text-[#D4D4D5] hover:bg-white/10'
                    : 'bg-[#F7F8FA] border-[#E0E1E2] text-[#1B1C1D] hover:bg-[#F2F3F5]'
                }`}
                title="Click to copy Shadow ID"
              >
                <span className="text-white font-extrabold text-[10px]">ID:</span>
                <span>{currentUser.shadowId}</span>
                <Copy size={11} className={isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676] ml-0.5'} />
              </button>

              {/* Simulated Rank Progression Toggle Button (PAWN ↔ KNIGHT) */}
              <button
                onClick={handleTogglePromote}
                disabled={isPromoting}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                  localRank === 'KNIGHT'
                    ? isDarkTheme
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-neutral-800 border-white/20 text-white'
                    : isDarkTheme
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    : 'bg-neutral-900 border-white/20 text-white hover:bg-neutral-800'
                }`}
                title="Advance from Foundation to Vanguard status"
              >
                <Sparkles size={12} className={isPromoting ? 'animate-spin' : ''} />
                <span>{localRank === 'KNIGHT' ? 'Knight (Vanguard)' : 'Pawn (Foundation)'}</span>
                <span className={`text-[9px] uppercase tracking-wider ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>Toggle</span>
              </button>
            </div>

            {/* PawnRankBadge with periodic sheen */}
            <PawnRankBadge
              rank={localRank}
              variant="profile"
              isDark={isDarkTheme}
              isPromoting={isPromoting}
              periodicSheen={true}
              onClick={handleTogglePromote}
            />

            {/* Bio & Tagline */}
            <p className={`text-xs leading-relaxed mt-2.5 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#555963]'}`}>
              UI/UX Design & Photography · Digital Shadow Identity · Zihuatanejo, Mexico
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {['#ShadowGenesis', '#CreativeMesh', '#RankUpgrade'].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-white hover:underline cursor-pointer"
                  onClick={() => onToast(`Filter tag: ${tag}`)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. SHADOW HIGHLIGHTS (Squircle Story Highlights)         */}
        {/* Streaks 🔥 | Genesis ♙ | Ranks ♘ | Nodes 🌐 | Badges 🏆  */}
        {/* ======================================================== */}
        <div className="space-y-1.5">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-1 ${isDarkTheme ? 'text-slate-400' : 'text-[#8E8E8E]'}`}>
            Shadow Highlights
          </span>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
            {SHADOW_HIGHLIGHTS.map((item) => (
              <button
                key={item.id}
                onClick={() => onToast(`Viewing highlight: ${item.label}`, 'sparkles')}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-[18px] p-[2px] transition-transform duration-300 group-hover:scale-105 active:scale-95 shadow-sm"
                  style={{ background: item.gradient }}
                >
                  <div
                    className={`w-full h-full rounded-[16px] flex items-center justify-center text-xl shadow-inner ${
                      isDarkTheme ? 'bg-[#222430]' : 'bg-[#FFFFFF]'
                    }`}
                  >
                    <span>{item.icon}</span>
                  </div>
                </div>
                <span className={`text-[10.5px] font-bold tracking-tight text-center ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#1B1C1D]'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. PRIMARY NAVIGATION TABS (Sem UI Segmented Tabs)       */}
        {/* ======================================================== */}
        <div
          className={`sticky top-13 z-20 pt-2 pb-2 rounded-[22px] border transition-colors ${
            isDarkTheme
              ? 'bg-[#1A1B24]/95 border-white/10 shadow-xl'
              : 'bg-[#FFFFFF]/95 border-[#E0E1E2] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
          }`}
        >
          {/* Main 4 Navigation Tabs */}
          <div className="flex px-2 text-xs font-bold gap-1 overflow-x-auto no-scrollbar">
            {/* Primary Prominent Tab: World Rankings */}
            <button
              onClick={() => setActiveMainTab('rankings')}
              className={`flex-1 min-w-[110px] py-2.5 text-center relative rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainTab === 'rankings'
                  ? 'bg-black text-white border border-white/20 shadow-md'
                  : isDarkTheme
                  ? 'text-[#8E92A0] hover:text-white hover:bg-white/5'
                  : 'bg-[#F7F8FA] text-[#767676] hover:text-[#1B1C1D] border border-[#E0E1E2]'
              }`}
            >
              <Crown size={14} className={activeMainTab === 'rankings' ? 'text-white' : ''} />
              <span className="truncate">World Rankings</span>
            </button>

            {/* Tab 2: World Upgrades */}
            <button
              onClick={() => setActiveMainTab('world')}
              className={`flex-1 min-w-[90px] py-2.5 text-center relative rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainTab === 'world'
                  ? 'bg-black text-white border border-white/20 shadow-md'
                  : isDarkTheme
                  ? 'text-[#8E92A0] hover:text-white hover:bg-white/5'
                  : 'bg-[#F7F8FA] text-[#767676] hover:text-[#1B1C1D] border border-[#E0E1E2]'
              }`}
            >
              <Globe size={14} />
              <span className="truncate">Upgrades ({upgrades.length})</span>
            </button>

            {/* Tab 3: People You Follow */}
            <button
              onClick={() => setActiveMainTab('following')}
              className={`flex-1 min-w-[85px] py-2.5 text-center relative rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainTab === 'following'
                  ? 'bg-black text-white border border-white/20 shadow-md'
                  : isDarkTheme
                  ? 'text-[#8E92A0] hover:text-white hover:bg-white/5'
                  : 'bg-[#F7F8FA] text-[#767676] hover:text-[#1B1C1D] border border-[#E0E1E2]'
              }`}
            >
              <Users size={14} />
              <span className="truncate">
                Following ({upgrades.filter((u) => u.isFollowing).length})
              </span>
            </button>

            {/* Tab 4: All */}
            <button
              onClick={() => setActiveMainTab('all')}
              className={`py-2.5 px-3 text-center relative rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMainTab === 'all'
                  ? 'bg-black text-white border border-white/20 shadow-md'
                  : isDarkTheme
                  ? 'text-[#8E92A0] hover:text-white hover:bg-white/5'
                  : 'bg-[#F7F8FA] text-[#767676] hover:text-[#1B1C1D] border border-[#E0E1E2]'
              }`}
            >
              <Trophy size={14} />
              <span className="truncate">All</span>
            </button>
          </div>

          {/* Search Bar & Tier Filters */}
          <div className="px-3 pt-2.5 space-y-2">
            <div className="flex items-center gap-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeMainTab === 'rankings'
                      ? 'Search rank, @username, city, ID...'
                      : 'Search creator, city, or rank...'
                  }
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none transition-colors ${
                    isDarkTheme
                      ? 'bg-white/5 border-white/10 text-white placeholder-[#8E92A0] focus:border-white/20'
                      : 'bg-[#F4F5F7] border-[#E0E1E2] text-[#1B1C1D] placeholder-[#767676] focus:border-white/20'
                  }`}
                />
              </div>

              {/* Last Synced Indicator */}
              {activeMainTab === 'rankings' && (
                <div className="shrink-0 text-[10px] font-mono hidden sm:inline-flex items-center gap-1 text-[#767676]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Synced: {lastSyncedTime}</span>
                </div>
              )}
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {['ALL', 'KING', 'QUEEN', 'ROOK', 'BISHOP', 'KNIGHT'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer shrink-0 ${
                    filterTier === tier
                      ? 'bg-black text-white border-white/20 shadow-xs'
                      : isDarkTheme
                      ? 'bg-white/5 text-[#8E92A0] border-white/5 hover:text-white'
                      : 'bg-[#F7F8FA] text-[#767676] border-[#E0E1E2] hover:text-[#1B1C1D]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. TAB 1: DEDICATED WORLD RANKINGS LEADERBOARD           */}
        {/* ======================================================== */}
        {activeMainTab === 'rankings' && (
          <div className="space-y-3.5">
            {/* A. PINNED: YOUR WORLD STANDING CARD */}
            {searchQuery === '' && filterTier === 'ALL' && (
              <div
                className={`relative rounded-[24px] p-4 border shadow-sm overflow-hidden transition-all ${
                  isDarkTheme
                    ? 'bg-neutral-900 border-white/10 text-white'
                    : 'bg-white border-neutral-200 text-neutral-900'
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                      Your Global Standing
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                      {localRank === 'KNIGHT' ? 'TOP 25%' : 'TOP 40%'}
                    </span>
                  </div>

                  <span className="text-xs font-black text-white font-mono">
                    Global Position: #48
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-full p-[2px] shadow-sm shrink-0 flex items-center justify-center"
                      style={{
                        background: isDarkTheme
                          ? currentUser.avatarGradient
                          : 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                      }}
                    >
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${isDarkTheme ? 'bg-[#12131A]' : 'bg-[#F7F8FA]'}`}>
                        {localRank === 'KNIGHT' ? (
                          <PremiumKnightInsignia size={24} glow={false} className={isDarkTheme ? 'text-white' : 'text-[#3E2723]'} />
                        ) : (
                          <PremiumPawnInsignia size={24} glow={false} className={isDarkTheme ? 'text-white' : 'text-[#3E2723]'} />
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                          {currentUser.name}
                        </span>
                        <ShieldCheck size={12} className="text-white shrink-0" />
                      </div>
                      <span className="text-[11px] font-semibold text-white block truncate">
                        @{currentUser.username}
                      </span>
                    </div>
                  </div>

                  {/* Copyable ID */}
                  <button
                    onClick={() => handleCopyId(currentUser.shadowId)}
                    className={`inline-flex items-center gap-1 font-mono text-[10px] px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
                      isDarkTheme
                        ? 'bg-white/5 border-white/10 text-[#D4D4D5] hover:bg-white/10'
                        : 'bg-[#F7F8FA] border-[#E0E1E2] text-[#1B1C1D] hover:bg-[#F2F3F5]'
                    }`}
                    title="Copy Shadow ID"
                  >
                    <span className="text-white font-bold">ID:</span>
                    <span>{currentUser.shadowId}</span>
                    <Copy size={10} className="text-[#767676] ml-0.5" />
                  </button>
                </div>

                {/* Progression Stepper Trigger */}
                <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${isDarkTheme ? 'border-white/5' : 'border-[#E0E1E2]'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] flex items-center gap-1 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#555963]'}`}>
                      <Flame size={12} className="fill-neutral-300 text-neutral-300" />
                      48 streaks
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[11px] text-white font-bold">
                      {localRank === 'KNIGHT' ? 'Vanguard Status Active' : 'Foundation Status'}
                    </span>
                  </div>

                  <button
                    onClick={handleTogglePromote}
                    disabled={isPromoting}
                    className="text-[10px] font-bold text-white hover:underline cursor-pointer"
                  >
                    {localRank === 'KNIGHT' ? 'Revert to Pawn' : 'Advance to Knight'}
                  </button>
                </div>
              </div>
            )}

            {/* B. TOP 3 GLOBAL PODIUM CARD (Editorial Reference Styling) */}
            {searchQuery === '' && filterTier === 'ALL' && (
              <div
                className={`p-4 rounded-[24px] border relative overflow-hidden transition-all ${
                  isDarkTheme
                    ? 'bg-[#1A1B24] border-white/10 shadow-lg'
                    : 'bg-[#FFFFFF] border-[#E0E1E2] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-white" />
                    <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                      Global Consensus Leaders (Top 3)
                    </h3>
                  </div>
                  <span className={`text-[10px] font-mono ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                    Apex Tier
                  </span>
                </div>

                {/* 3 Podium Pillars */}
                <div className="grid grid-cols-3 gap-2.5 items-end pt-1 pb-1">
                  {/* #2 Sofia Lindqvist (Silver) */}
                  {worldRankings[1] && (
                    <div
                      onClick={() => onToast(`Rank #2: @${worldRankings[1].username} · ${worldRankings[1].shadowStatus}`, 'sparkles')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer hover:scale-[1.02] ${
                        isDarkTheme
                          ? 'bg-white/[0.03] border-slate-400/30'
                          : 'bg-[#F7F8FA] border-[#E0E1E2] shadow-xs'
                      }`}
                    >
                      <span className={`text-[10px] font-black block mb-1 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#555963]'}`}>
                        🥈 #2 Silver
                      </span>
                      <div
                        className="w-11 h-11 rounded-full mx-auto flex items-center justify-center text-white text-lg font-bold mb-1.5 shadow-sm ring-2 ring-slate-300"
                        style={{ backgroundColor: worldRankings[1].avatarBg }}
                      >
                        {worldRankings[1].avatarSymbol}
                      </div>
                      <span className={`text-xs font-bold block truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                        {worldRankings[1].name}
                      </span>
                      <span className="text-[10.5px] font-extrabold text-white block truncate">
                        @{worldRankings[1].username}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId(worldRankings[1].shadowId);
                        }}
                        className={`text-[9.5px] font-mono mt-1 block truncate mx-auto ${isDarkTheme ? 'text-[#8E92A0] hover:text-white' : 'text-[#767676] hover:text-[#1B1C1D]'}`}
                      >
                        {worldRankings[1].shadowId}
                      </button>
                      <span className={`text-[10px] font-black block mt-1 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#1B1C1D]'}`}>
                        {(worldRankings[1].reputation / 1000).toFixed(1)}k REP
                      </span>
                    </div>
                  )}

                  {/* #1 David Chen (Gold Centerpiece) */}
                  {worldRankings[0] && (
                    <div
                      onClick={() => onToast(`Rank #1: @${worldRankings[0].username} · ${worldRankings[0].shadowStatus}`, 'sparkles')}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer hover:scale-[1.02] -mt-2 ${
                        isDarkTheme
                          ? 'bg-gradient-to-b from-white/10 via-[#222430] to-[#1A1B24] border-white/20 ring-1 ring-white/30 shadow-xl'
                          : 'bg-gradient-to-b from-white/10 via-white to-white/5 border-white/20 shadow-sm ring-1 ring-white/30'
                      }`}
                    >
                      <span className="text-[10px] font-black text-neutral-300 block mb-1">
                        👑 #1 Gold
                      </span>
                      <div
                        className="w-13 h-13 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold mb-1.5 shadow-md ring-3 ring-white/30"
                        style={{ backgroundColor: worldRankings[0].avatarBg }}
                      >
                        {worldRankings[0].avatarSymbol}
                      </div>
                      <span className={`text-xs font-black block truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                        {worldRankings[0].name}
                      </span>
                      <span className="text-[11px] font-extrabold text-neutral-300 block truncate">
                        @{worldRankings[0].username}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId(worldRankings[0].shadowId);
                        }}
                        className={`text-[9.5px] font-mono mt-1 block truncate mx-auto ${isDarkTheme ? 'text-[#8E92A0] hover:text-white' : 'text-[#767676] hover:text-[#1B1C1D]'}`}
                      >
                        {worldRankings[0].shadowId}
                      </button>
                      <span className="text-[10.5px] font-black text-neutral-300 block mt-1">
                        {(worldRankings[0].reputation / 1000).toFixed(1)}k REP
                      </span>
                    </div>
                  )}

                  {/* #3 Jin-Woo Park (Bronze) */}
                  {worldRankings[2] && (
                    <div
                      onClick={() => onToast(`Rank #3: @${worldRankings[2].username} · ${worldRankings[2].shadowStatus}`, 'sparkles')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer hover:scale-[1.02] ${
                        isDarkTheme
                          ? 'bg-white/[0.03] border-white/20'
                          : 'bg-[#F7F8FA] border-[#E0E1E2] shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-black text-neutral-400 block mb-1">
                        🥉 #3 Bronze
                      </span>
                      <div
                        className="w-11 h-11 rounded-full mx-auto flex items-center justify-center text-white text-lg font-bold mb-1.5 shadow-sm ring-2 ring-white/30"
                        style={{ backgroundColor: worldRankings[2].avatarBg }}
                      >
                        {worldRankings[2].avatarSymbol}
                      </div>
                      <span className={`text-xs font-bold block truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                        {worldRankings[2].name}
                      </span>
                      <span className="text-[10.5px] font-extrabold text-white block truncate">
                        @{worldRankings[2].username}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId(worldRankings[2].shadowId);
                        }}
                        className={`text-[9.5px] font-mono mt-1 block truncate mx-auto ${isDarkTheme ? 'text-[#8E92A0] hover:text-white' : 'text-[#767676] hover:text-[#1B1C1D]'}`}
                      >
                        {worldRankings[2].shadowId}
                      </button>
                      <span className="text-[10px] font-black text-neutral-400 block mt-1">
                        {(worldRankings[2].reputation / 1000).toFixed(1)}k REP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* C. LOADING SKELETONS DURING ASYNC SYNC */}
            {isFetchingRankings && (
              <div className="space-y-3 py-1">
                {[1, 2, 3].map((sk) => (
                  <div
                    key={sk}
                    className={`p-4 rounded-[24px] border animate-pulse ${
                      isDarkTheme ? 'bg-[#1A1B24] border-white/5' : 'bg-[#FFFFFF] border-[#E0E1E2]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${isDarkTheme ? 'bg-white/10' : 'bg-slate-100'}`} />
                      <div className="flex-1 space-y-2">
                        <div className={`w-1/3 h-3.5 rounded ${isDarkTheme ? 'bg-white/10' : 'bg-slate-100'}`} />
                        <div className={`w-1/4 h-2.5 rounded ${isDarkTheme ? 'bg-white/10' : 'bg-slate-100'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* D. CONCEPT UI RANKING CARDS LIST (Clean White Editorial Style) */}
            {!isFetchingRankings && (
              <div className="space-y-3">
                {filteredRankings.length === 0 ? (
                  <div
                    className={`p-8 rounded-[24px] border text-center ${
                      isDarkTheme ? 'bg-[#1A1B24] border-white/10' : 'bg-[#FFFFFF] border-[#E0E1E2]'
                    }`}
                  >
                    <Crown size={32} className="mx-auto text-slate-400 mb-2 opacity-50" />
                    <h3 className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                      No Node Operators Match Your Query
                    </h3>
                    <p className={`text-xs mt-1 max-w-xs mx-auto ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                      Try adjusting the search query or selecting ALL from the rank filter pills.
                    </p>
                  </div>
                ) : (
                  filteredRankings.map((user) => {
                    return (
                      <div
                        key={user.id}
                        className={`relative rounded-[24px] p-4 border transition-all hover:border-white/20/50 ${
                          isDarkTheme
                            ? 'bg-[#1C0D36] border-white/10 shadow-black/40'
                            : 'bg-[#FFFFFF] border-[#E0E1E2] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
                        }`}
                      >
                        {/* Specular Top Rim */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                        />

                        {/* Top Meta Bar: Global Position Badge & Shadow Rank Callout Bar */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {/* Global Position Metallic Pill */}
                            <span
                              className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                user.rankPosition === 1
                                  ? 'bg-white/10 text-white border border-white/20'
                                  : user.rankPosition === 2
                                  ? 'bg-slate-100 text-slate-800 border border-slate-300'
                                  : user.rankPosition === 3
                                  ? 'bg-white/10 text-white border border-white/20'
                                  : isDarkTheme
                                  ? 'bg-white/5 text-[#D4D4D5] border border-white/10'
                                  : 'bg-[#F7F8FA] text-[#1B1C1D] border border-[#E0E1E2]'
                              }`}
                            >
                              {user.rankPosition === 1 && '👑'}
                              {user.rankPosition === 2 && '🥈'}
                              {user.rankPosition === 3 && '🥉'}
                              <span>#{user.rankPosition}</span>
                            </span>

                            {/* Shadow Status Rank Callout Bar */}
                            <span className={`text-[10.5px] font-bold ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                              RANK: <span className="text-white font-extrabold">{user.shadowRank}</span> · {user.shadowStatus}
                            </span>
                          </div>

                          <span className={`text-[10px] font-mono uppercase tracking-wider ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                            {user.tierLevel}
                          </span>
                        </div>

                        {/* Creator Row: Avatar, Username, Location & Follow Button */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Circular Avatar */}
                            <div className="relative shrink-0">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm"
                                style={{ backgroundColor: user.avatarBg }}
                              >
                                {user.avatarSymbol}
                              </div>
                              {user.isVerified && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                  <ShieldCheck size={10} className="fill-white/10 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Name, @username & Location */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className={`text-xs font-black truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                                  {user.name}
                                </h4>
                              </div>
                              <span className="text-xs font-black text-white block truncate">
                                @{user.username}
                              </span>
                              <div className={`flex items-center gap-1 text-[10.5px] mt-0.5 ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                                <span>{user.flag}</span>
                                <span className="truncate">{user.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Follow / Following Toggle Button */}
                          <button
                            onClick={() => handleToggleFollowRanking(user.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer active:scale-95 shrink-0 ${
                              user.isFollowing
                                ? isDarkTheme
                                  ? 'bg-white/10 border-white/20 text-[#2ECC71]'
                                  : 'bg-[#F7F8FA] border-[#E0E1E2] text-[#1B1C1D]'
                                : 'bg-[#1B1C1D] border-[#1B1C1D] text-white shadow-xs hover:opacity-90'
                            }`}
                          >
                            {user.isFollowing ? (
                              <>
                                <UserCheck size={11} />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <UserPlus size={11} />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Dedicated Shadow ID Capsule on Every Card */}
                        <div className="mb-3">
                          <button
                            onClick={() => handleCopyId(user.shadowId)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono transition-all cursor-pointer active:scale-95 ${
                              isDarkTheme
                                ? 'bg-white/5 border-white/10 text-[#D4D4D5] hover:bg-white/10'
                                : 'bg-[#F7F8FA] border-[#E0E1E2] text-[#1B1C1D] hover:bg-[#F2F3F5]'
                            }`}
                            title="Click to copy Shadow ID"
                          >
                            <span className="text-white font-extrabold text-[10px]">ID:</span>
                            <span>{user.shadowId}</span>
                            <Copy size={11} className={isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676] ml-0.5'} />
                          </button>
                        </div>

                        {/* Status Quote */}
                        <p className={`text-xs leading-relaxed mb-3 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#555963]'}`}>
                          "{user.statusQuote}"
                        </p>

                        {/* Protocol Metrics & Interactive Cheer Heart Reaction */}
                        <div className={`flex items-center justify-between pt-2.5 border-t ${isDarkTheme ? 'border-white/5' : 'border-[#E0E1E2]'}`}>
                          {/* Protocol Metrics Pills */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-black ${
                              isDarkTheme ? 'bg-black/20 border border-white/20/40 text-white' : 'bg-neutral-900 border border-white/20 text-white'
                            }`}>
                              <span>{user.reputation.toLocaleString()} REP</span>
                            </div>

                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold ${
                              isDarkTheme ? 'bg-white/10 border border-white/20 text-white' : 'bg-[#FFFBEB] border border-white/20 text-neutral-300'
                            }`}>
                              <Flame size={11} className="fill-neutral-300 text-neutral-300" />
                              <span>{user.streakDays}d Streak</span>
                            </div>

                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold hidden sm:inline-flex ${
                              isDarkTheme ? 'bg-white/10 border border-white/20 text-neutral-300' : 'bg-[#F0FDFA] border border-white/20 text-white'
                            }`}>
                              <Radio size={10} />
                              <span>{user.nodesActive} Nodes</span>
                            </div>
                          </div>

                          {/* Interactive Cheer Button with Animated Heart Reactions */}
                          <button
                            onClick={() => handleToggleCheerRanking(user.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                              user.hasCheered
                                ? isDarkTheme
                                  ? 'bg-black/30 border-white/20/60 text-white shadow-sm'
                                  : 'bg-neutral-900 border-white/20 text-white shadow-xs'
                                : isDarkTheme
                                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-[#D4D4D5]'
                                : 'bg-[#F7F8FA] hover:bg-[#F2F3F5] border-[#E0E1E2] text-[#1B1C1D]'
                            }`}
                            title="Cheer for this operator"
                          >
                            <Heart
                              size={13}
                              className={`transition-transform ${
                                user.hasCheered
                                  ? 'fill-white text-white scale-110 animate-bounce'
                                  : isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'
                              }`}
                            />
                            <span>{user.cheerCount}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. TAB 2, 3, 4: LIVE RANK UPGRADES ACTIVITY FEEDS         */}
        {/* World Upgrades | Following | All                         */}
        {/* ======================================================== */}
        {activeMainTab !== 'rankings' && (
          <div className="space-y-3">
            {filteredUpgrades.length === 0 ? (
              <div
                className={`p-8 rounded-[24px] border text-center ${
                  isDarkTheme ? 'bg-[#1A1B24] border-white/10' : 'bg-[#FFFFFF] border-[#E0E1E2]'
                }`}
              >
                <Users size={32} className="mx-auto text-slate-400 mb-2 opacity-50" />
                <h3 className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                  {activeMainTab === 'following'
                    ? 'No Upgrades From Followed Creators Yet'
                    : 'No Upgrades Match Your Filter'}
                </h3>
                <p className={`text-xs mt-1 max-w-xs mx-auto ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                  {activeMainTab === 'following'
                    ? 'Follow creators from the World Rankings or Upgrades feed to track their rank promotions in real time.'
                    : 'Try clearing your search query or selecting a different rank tier.'}
                </p>
                {activeMainTab === 'following' && (
                  <button
                    onClick={() => setActiveMainTab('world')}
                    className="mt-3 px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
                  >
                    Explore World Feed
                  </button>
                )}
              </div>
            ) : (
              filteredUpgrades.map((person) => {
                const toMeta = getRankMeta(person.toRank);
                const fromMeta = getRankMeta(person.fromRank);

                return (
                  <div
                    key={person.id}
                    className={`p-4 rounded-[24px] border transition-all hover:border-white/20/50 ${
                      isDarkTheme
                        ? 'bg-[#1C0D36] border-white/10 shadow-black/40'
                        : 'bg-[#FFFFFF] border-[#E0E1E2] shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
                    }`}
                  >
                    {/* Card Header: Creator Row & Follow Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0"
                          style={{ backgroundColor: person.avatarBg }}
                        >
                          <span>{person.avatarSymbol}</span>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`text-xs font-black truncate ${isDarkTheme ? 'text-white' : 'text-[#1B1C1D]'}`}>
                              {person.name}
                            </h4>
                            {person.isVerified && (
                              <ShieldCheck size={12} className="text-white shrink-0" />
                            )}
                          </div>
                          <div className={`flex items-center gap-1 text-[11px] ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                            <span className="text-white font-bold">@{person.username}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <span>{person.flag}</span>
                              <span className="truncate">{person.location}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Follow / Following Toggle */}
                      <button
                        onClick={() => handleToggleFollowUpgrade(person.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer active:scale-95 shrink-0 ${
                          person.isFollowing
                            ? isDarkTheme
                              ? 'bg-white/10 border-white/20 text-[#2ECC71]'
                              : 'bg-[#F7F8FA] border-[#E0E1E2] text-[#1B1C1D]'
                            : 'bg-[#1B1C1D] border-[#1B1C1D] text-white shadow-xs hover:opacity-90'
                        }`}
                      >
                        {person.isFollowing ? (
                          <>
                            <UserCheck size={11} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={11} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Rank Evolution Pill: PAWN ➔ KNIGHT */}
                    <div
                      className={`p-2.5 rounded-2xl border mb-3 flex items-center justify-between ${
                        isDarkTheme ? 'bg-white/[0.03] border-white/5' : 'bg-[#F7F8FA] border-[#E0E1E2]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-base select-none">{fromMeta.symbol}</span>
                        <span className={`text-xs font-bold ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#555963]'}`}>
                          {person.fromRank}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-white">
                        <ArrowRight size={14} className="animate-pulse" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-base select-none">{toMeta.symbol}</span>
                        <span
                          className="text-xs font-black uppercase px-2 py-0.5 rounded-full text-white shadow-xs"
                          style={{
                            background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                          }}
                        >
                          {person.toRank}
                        </span>
                        <span className={`text-[10px] font-mono ${isDarkTheme ? 'text-[#8E92A0]' : 'text-[#767676]'}`}>
                          ({person.toTier})
                        </span>
                      </div>
                    </div>

                    {/* Achievement Summary */}
                    <p className={`text-xs leading-relaxed mb-3 ${isDarkTheme ? 'text-[#D4D4D5]' : 'text-[#555963]'}`}>
                      {person.achievementSummary}
                    </p>

                    {/* Card Footer: Streak Days, Rep Gained, & Congratulate Button */}
                    <div className={`flex items-center justify-between pt-2 border-t ${isDarkTheme ? 'border-white/5' : 'border-[#E0E1E2]'}`}>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold ${
                          isDarkTheme ? 'bg-white/10 border border-white/20 text-white' : 'bg-[#FFFBEB] border border-white/20 text-neutral-300'
                        }`}>
                          <Flame size={12} className="fill-neutral-300 text-neutral-300" />
                          <span>{person.streakDays}d Streak</span>
                        </div>

                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold ${
                          isDarkTheme ? 'bg-black/20 border border-white/20/40 text-white' : 'bg-neutral-900 border border-white/20 text-white'
                        }`}>
                          <span>+{person.repGained} REP</span>
                        </div>
                      </div>

                      {/* Interactive Congratulate / Cheer Button */}
                      <button
                        onClick={() => handleToggleCongratulate(person.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                          person.hasCongratulated
                            ? isDarkTheme
                              ? 'bg-black/30 border-white/20/60 text-white shadow-sm'
                              : 'bg-neutral-900 border-white/20 text-white shadow-xs'
                            : isDarkTheme
                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-[#D4D4D5]'
                            : 'bg-[#F7F8FA] hover:bg-[#F2F3F5] border-[#E0E1E2] text-[#1B1C1D]'
                        }`}
                        title="Cheer and congratulate on rank promotion"
                      >
                        <span className={person.hasCongratulated ? 'animate-bounce' : ''}>🎉</span>
                        <span>{person.congratsCount}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
