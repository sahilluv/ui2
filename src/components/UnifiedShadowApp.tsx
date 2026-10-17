import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  Plus,
  Send,
  Grid,
  Bookmark,
  Tv,
  ShoppingBag,
  Moon,
  Sun,
  X,
  Play,
  Pause,
  Check,
  LogOut,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  Camera,
  Music,
  Disc,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bell,
  ArrowDown,
  RotateCw,
} from 'lucide-react';
import {
  PawnRankBadge,
  ShadowRankType,
  triggerRankConfetti,
  playRankElevationChime,
} from './PawnRankBadge';
import { ReelCommentsDrawer } from './ReelCommentsDrawer';
import { PullUpRefresh } from './PullUpRefresh';
import { MyShadowScreen } from './MyShadowScreen';
import { darkColors, lightColors, shadowGradients, ThemeColors } from '../../expo-code/src/theme';
import { generateMoreFeedPosts, generateMoreReelData } from '../utils/endlessScrollData';
import { ReelCircularProgress } from './ReelCircularProgress';

export type UnifiedTab = 'home' | 'explore' | 'reels' | 'create' | 'notifications' | 'profile';

export type EncounterValidationStatus = 'pending' | 'verified' | 'rejected';

export interface ShadowEncounter {
  /** Unique identifier of the encounter event */
  encounterId: string;
  /** Reference to the physical Shadow / wearable device or campaign projection ID encountered */
  shadowId: string;
  /** Optional reference to the user who projected the physical Shadow */
  emitterUserId?: string;
  /** Optional campaign identifier if the physical Shadow was projecting a brand campaign */
  campaignId?: string;
  /** ISO-8601 timestamp or Unix epoch ms when the physical encounter was captured */
  timestamp: string;
  /** Mocked real-world location metadata where the encounter took place */
  location: {
    latitude: number;
    longitude: number;
    placeName: string;
    accuracyMeters?: number;
    isMocked: boolean;
  };
  /** Verification state used to separate unverified captures from validated participation */
  validationStatus: EncounterValidationStatus;
  /** Optional reference to an active Shadow Chain / Streak this encounter extends */
  chainId?: string;
}

export interface FeedPost {
  id: string;
  authorName: string;
  username: string;
  avatarGradient: [string, string, ...string[]];
  timeAgo: string;
  imageGradient: [string, string, ...string[]];
  content: string;
  captionTitle?: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  /** Distinguishes standard social posts from real-world Shadow Encounters */
  postType?: 'standard' | 'shadow_encounter';
  /** Present when the post represents a captured real-world Shadow Encounter */
  shadowEncounter?: ShadowEncounter;
}

const INITIAL_STORIES = [
  { id: 'user_story', username: 'Your story', isCurrentUser: true, gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 's1', username: 'Ezequias', gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 's2', username: 'Alice_002', gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 's3', username: 'Paulette_R', gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 's4', username: 'Carlos_v', gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
];

const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    authorName: 'Maoo Lopez',
    username: 'maoo.lopez',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: '20m ago',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'This photomanipulation inspired by generative biology and organic surrealism. What do you think of this color palette?',
    captionTitle: 'SACRIFICE | VIRUS',
    likesCount: 4558,
    commentsCount: 300,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_2',
    authorName: 'Eliott Johnson',
    username: 'eliott.j',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: '2h ago',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'Central campus library west wing is open 24/7 during finals sprint. Plenty of charging stations on the 3rd floor!',
    captionTitle: 'CAMPUS SPACES',
    likesCount: 2420,
    commentsCount: 175,
    isLiked: true,
    isSaved: true,
  },
  {
    id: 'post_3',
    authorName: 'Sofia Reyes',
    username: 'sofia.design',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: '4h ago',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'Looking for 2 UI developers for our upcoming inter-college hackathon build. Drop a comment if interested!',
    captionTitle: 'HACKATHON COLLAB',
    likesCount: 1890,
    commentsCount: 94,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_encounter_1',
    authorName: 'Kenji Sato',
    username: 'kenji.tokyo',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: '5h ago',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'Physical node encounter captured at Shibuya Crossing node beacon. Chain extended +450 REP.',
    captionTitle: 'SHADOW ENCOUNTER #882',
    likesCount: 3120,
    commentsCount: 88,
    isLiked: false,
    isSaved: false,
    postType: 'shadow_encounter',
    shadowEncounter: {
      encounterId: 'enc_shibuya_9921',
      shadowId: 'shdw_kenji04',
      emitterUserId: 'usr_tokyo_node_01',
      timestamp: '2026-10-12T05:30:00Z',
      location: {
        latitude: 35.6595,
        longitude: 139.7004,
        placeName: 'Tokyo, Japan (Shibuya Hub)',
        isMocked: true,
      },
      validationStatus: 'verified',
      chainId: 'chain_global_tokyo_09',
    },
  },
];

const NEW_FEED_POSTS_POOL: FeedPost[] = [
  {
    id: 'post_fresh_elena',
    authorName: 'Elena Rostova',
    username: 'elena.art',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: 'Just now',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'Generative bio-crystal forms rendered with chromatic aberration. Testing our new shadow depth shaders!',
    captionTitle: 'CHROMA RESONANCE',
    likesCount: 512,
    commentsCount: 42,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_fresh_marcus',
    authorName: 'Marcus Chen',
    username: 'marcus.vfx',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: 'Just now',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'Interactive fluid simulation running in real-time WebGL on mobile GPU! Drop feedback on framerate below.',
    captionTitle: 'FLUID DYNAMICS',
    likesCount: 388,
    commentsCount: 29,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_fresh_kai',
    authorName: 'Kai Tanaka',
    username: 'kai.sound',
    avatarGradient: ['#242424', '#141414'],
    timeAgo: 'Just now',
    imageGradient: ['#262626', '#1A1A1A', '#101010'],
    content: 'Spatial ambient score for the upcoming Shadow exhibition. Best experienced with studio headphones 🎧',
    captionTitle: 'SPATIAL AUDIO',
    likesCount: 674,
    commentsCount: 58,
    isLiked: true,
    isSaved: false,
  },
];

const EXPLORE_CATEGORIES = [
  { id: 'igtv', title: 'IGTV', icon: Tv, gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 'campus', title: 'CAMPUS', icon: ShoppingBag, gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 'viajes', title: 'TRAVEL', icon: Sparkles, gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
  { id: 'wellness', title: 'WELLNESS', icon: Heart, gradient: ['#2A2A2A', '#161616', '#0A0A0A'] },
];

const EXPLORE_CARDS = [
  { id: 'm1', height: 210, gradient: ['#2A2A2A', '#161616', '#0A0A0A'], title: 'Deep Obsidian' },
  { id: 'm2', height: 140, gradient: ['#2A2A2A', '#161616', '#0A0A0A'], title: 'Midnight Ultraviolet' },
  { id: 'm3', height: 160, gradient: ['#2A2A2A', '#161616', '#0A0A0A'], title: 'Electric Indigo' },
  { id: 'm4', height: 230, gradient: ['#2A2A2A', '#161616', '#0A0A0A'], title: 'Teal Study #04' },
  { id: 'm5', height: 150, gradient: ['#2A2A2A', '#161616', '#0A0A0A'], title: 'Pastel Sunrise' },
  { id: 'm6', height: 180, gradient: ['#2A2A2A', '#161616', '#0A0A0A'], title: 'Neon Bloom' },
];

export interface ReelData {
  id: string;
  author: string;
  username: string;
  location: string;
  gradient: string[];
  likes: string;
  likesCount: number;
  comments: string;
  commentsCount: number;
  bookmarksCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing?: boolean;
  caption: string;
  tags: string[];
  audioTrack: string;
  avatarGradient: string[];
}

const REELS_DATA: ReelData[] = [
  {
    id: 'reel_1',
    author: 'Eliott Johnson',
    username: 'eliott.j',
    location: 'Madrid, Spain',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    likes: '2.4k',
    likesCount: 2400,
    comments: '175',
    commentsCount: 175,
    bookmarksCount: 89,
    isLiked: true,
    isSaved: false,
    isFollowing: true,
    caption: 'Architectural Brutalism & sunset reflections across Madrid 🏛️✨',
    tags: ['#campus', '#architecture', '#design', '#madrid'],
    audioTrack: 'Eliott Johnson • Sunset Echoes (Original Audio)',
    avatarGradient: ['#242424', '#141414'],
  },
  {
    id: 'reel_2',
    author: 'Christian Lue',
    username: 'christian.lue',
    location: 'Ghent, Belgium',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    likes: '3.8k',
    likesCount: 3820,
    comments: '290',
    commentsCount: 290,
    bookmarksCount: 142,
    isLiked: false,
    isSaved: true,
    isFollowing: false,
    caption: 'Late night design studio session in Ghent ☕️💻 Crafting new Shadow interactions',
    tags: ['#creativestudio', '#shadowapp', '#nightshift'],
    audioTrack: 'Lofi Beats • Studio Chill Vol. 3',
    avatarGradient: ['#242424', '#141414'],
  },
  {
    id: 'reel_3',
    author: 'Sofia Martinez',
    username: 'sofia.mtz',
    location: 'Tokyo, Japan',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    likes: '5.1k',
    likesCount: 5120,
    comments: '412',
    commentsCount: 412,
    bookmarksCount: 320,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    caption: 'Neon reflections across Shibuya crossing under midnight rain 🌧️⚡️',
    tags: ['#tokyo', '#cyberpunk', '#streetphotography'],
    audioTrack: 'Sofia Martinez • Tokyo Rain (Ambient Mix)',
    avatarGradient: ['#242424', '#141414'],
  },
  {
    id: 'reel_4',
    author: 'Mauricio Lopez',
    username: 'mauricio.lopez',
    location: 'Valencia, Spain',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    likes: '4.2k',
    likesCount: 4210,
    comments: '330',
    commentsCount: 330,
    bookmarksCount: 195,
    isLiked: true,
    isSaved: true,
    isFollowing: false,
    caption: 'Shadow Dynamic Lighting & Concept Component System preview 🔮🎨',
    tags: ['#shadowcampus', '#uidesign', '#minimalism'],
    audioTrack: 'Mauricio Lopez • Shadow Pulse',
    avatarGradient: ['#242424', '#141414'],
  },
];

const NOTIFICATIONS_DATA = [
  {
    id: 'n1',
    user: 'Elena Rostova',
    username: 'elena.art',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    action: 'liked your post "SACRIFICE | VIRUS"',
    time: '5m ago',
    unread: true,
  },
  {
    id: 'n2',
    user: 'Carlos Valenzuela',
    username: 'carlos_v',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    action: 'commented: "The color palette and composition are incredible 🔥"',
    time: '23m ago',
    unread: true,
  },
  {
    id: 'n3',
    user: 'Sofia Mendez',
    username: 'sofia_art',
    gradient: ['#2A2A2A', '#161616', '#0A0A0A'],
    action: 'started following you.',
    time: '2h ago',
    unread: false,
  },
];

interface UnifiedShadowAppProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const UnifiedShadowApp: React.FC<UnifiedShadowAppProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const colors = isDark ? darkColors : lightColors;

  // Active screen tab
  const [currentTab, setCurrentTab] = useState<UnifiedTab>('home');
  const [isViewingMyShadow, setIsViewingMyShadow] = useState(false);

  const handleTabChange = (tab: UnifiedTab) => {
    setIsViewingMyShadow(false);
    setCurrentTab(tab);
  };

  // Transparent Offline-First Cache for Unified Feed & Reels
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('unified_shadow_feed_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (_e) {
      // Ignore
    }
    return INITIAL_FEED_POSTS;
  });

  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const [reels, setReels] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('unified_shadow_reels_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (_e) {
      // Ignore
    }
    return REELS_DATA;
  });

  // Background persistence
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('unified_shadow_feed_v1', JSON.stringify(feedPosts));
      }
    } catch (_e) {
      // Ignore
    }
  }, [feedPosts]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('unified_shadow_reels_v1', JSON.stringify(reels));
      }
    } catch (_e) {
      // Ignore
    }
  }, [reels]);

  // Transparent background revalidation
  useEffect(() => {
    const revalidate = async () => {
      try {
        await fetch('/api/feed');
        await fetch('/api/reels');
      } catch (_e) {
        // Silently handled: offline-first cache continues serving
      }
    };
    void revalidate();
    window.addEventListener('online', revalidate);
    return () => window.removeEventListener('online', revalidate);
  }, []);

  // Authenticated User State (Real Shadow Identity)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Mauricio Lopez',
    username: 'maoo.lopez',
    email: 'mauricio@shadow.campus',
    bio: 'Visual Designer & Photography - Campus Community',
    shadowId: 'sh_89f02a91',
    shadowRank: 'PAWN' as ShadowRankType,
    verification: 'VERIFIED',
    postsCount: 12,
    followersCount: 876,
    followingCount: 568,
  });

  // Rank progression elevation transition state
  const [isPromotingRank, setIsPromotingRank] = useState(false);

  const handleToggleUserRank = (e?: React.MouseEvent) => {
    if (isPromotingRank) return;
    setIsPromotingRank(true);
    const nextRank: ShadowRankType = currentUser.shadowRank === 'PAWN' ? 'KNIGHT' : 'PAWN';

    let origin: { x: number; y: number } | undefined;
    if (e && typeof window !== 'undefined') {
      origin = {
        x: Math.min(Math.max(e.clientX / window.innerWidth, 0.1), 0.9),
        y: Math.min(Math.max(e.clientY / window.innerHeight, 0.1), 0.9),
      };
    }

    playRankElevationChime(nextRank === 'KNIGHT');
    triggerRankConfetti(nextRank, origin);

    setCurrentUser((prev) => ({ ...prev, shadowRank: nextRank }));
    showToast(
      nextRank === 'KNIGHT'
        ? '✦ Rank Elevated: KNIGHT (Rank II · Vanguard Status)'
        : '✦ Rank Reverted: PAWN (Rank I · Foundation Status)'
    );

    setTimeout(() => {
      setIsPromotingRank(false);
    }, 1200);
  };

  // Create Post Form State
  const [createTitle, setCreateTitle] = useState('');
  const [createBody, setCreateBody] = useState('');
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);

  // Share & Comments Modals
  const [selectedSharePost, setSelectedSharePost] = useState<FeedPost | null>(null);
  const [activeReelComments, setActiveReelComments] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const handleToggleLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  // Scroll-Responsive Bottom Navigation State
  const [isCompactNav, setIsCompactNav] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [pausedReels, setPausedReels] = useState<Record<string, boolean>>({});
  const [heartPopReelId, setHeartPopReelId] = useState<string | null>(null);

  const reelsScrollRef = useRef<HTMLDivElement>(null);
  const feedScrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevFeedScrollTop = useRef(0);
  const prevReelsScrollTop = useRef(0);

  // Endless pagination state
  const feedPageRef = useRef(1);
  const [isLoadingMoreFeed, setIsLoadingMoreFeed] = useState(false);

  const loadMoreFeedPosts = async () => {
    if (isLoadingMoreFeed) return;
    setIsLoadingMoreFeed(true);
    try {
      await new Promise((r) => setTimeout(r, 380));
      feedPageRef.current += 1;
      const nextPosts = generateMoreFeedPosts(feedPageRef.current, 3);
      setFeedPosts((prev) => [...prev, ...nextPosts]);
    } finally {
      setIsLoadingMoreFeed(false);
    }
  };

  const reelsPageRef = useRef(1);
  const [isLoadingMoreReels, setIsLoadingMoreReels] = useState(false);

  const loadMoreReelsData = async () => {
    if (isLoadingMoreReels) return;
    setIsLoadingMoreReels(true);
    try {
      await new Promise((r) => setTimeout(r, 340));
      reelsPageRef.current += 1;
      const nextReels = generateMoreReelData(reelsPageRef.current, 3);
      setReels((prev) => [...prev, ...nextReels]);
    } finally {
      setIsLoadingMoreReels(false);
    }
  };

  const handleFeedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const diff = scrollTop - prevFeedScrollTop.current;

    if (scrollTop <= 15) {
      setIsCompactNav(false);
    } else if (diff > 4) {
      setIsCompactNav(true);
    } else if (diff < -4) {
      // Smoothly restore full size when scrolling up
      setIsCompactNav(false);
    }

    // Endless Feed Scrolling: load next batch when nearing bottom
    const { scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + clientHeight) < 420 && !isLoadingMoreFeed) {
      void loadMoreFeedPosts();
    }

    prevFeedScrollTop.current = scrollTop;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsCompactNav(false);
    }, 1000);
  };

  const handleReelsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const diff = scrollTop - prevReelsScrollTop.current;

    if (scrollTop <= 15) {
      setIsCompactNav(false);
    } else if (diff > 4) {
      setIsCompactNav(true);
    } else if (diff < -4) {
      // Smoothly restore full size when scrolling up
      setIsCompactNav(false);
    }

    // Endless Reels Scrolling: load next batch when nearing bottom
    const { scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + clientHeight) < 600 && !isLoadingMoreReels) {
      void loadMoreReelsData();
    }

    prevReelsScrollTop.current = scrollTop;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsCompactNav(false);
    }, 1000);
  };

  // Pull-To-Refresh State & Handlers for Feed View
  const [pullDownDistance, setPullDownDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [isPullDragging, setIsPullDragging] = useState(false);
  const pullStartYRef = useRef<number | null>(null);
  const freshPostIndexRef = useRef(0);
  const PULL_THRESHOLD = 58;

  const executeRefreshFeed = async () => {
    if (isPullRefreshing) return;
    setIsPullRefreshing(true);
    setPullDownDistance(54);

    try {
      // Simulate real fetch with network latency
      await new Promise((r) => setTimeout(r, 850));

      // Attempt background endpoint fetch if online
      try {
        await fetch('/api/feed');
      } catch (_e) {
        // Silently handled
      }

      // Cycle next post from fresh pool
      const nextPostToInject = NEW_FEED_POSTS_POOL[freshPostIndexRef.current % NEW_FEED_POSTS_POOL.length];
      freshPostIndexRef.current += 1;

      setFeedPosts((prev) => {
        // Update likes slightly on existing posts to simulate live activity
        const updatedExisting = prev.map((p, idx) => ({
          ...p,
          likesCount: p.likesCount + (idx % 2 === 0 ? Math.floor(Math.random() * 8) + 2 : 0),
        }));

        const exists = prev.some((p) => p.id === nextPostToInject.id);
        const postToAdd: FeedPost = exists
          ? {
              ...nextPostToInject,
              id: `${nextPostToInject.id}_${Date.now()}`,
              timeAgo: 'Just now',
            }
          : { ...nextPostToInject, timeAgo: 'Just now' };

        return [postToAdd, ...updatedExisting];
      });

      showToast('Feed updated with latest posts!');
    } finally {
      setIsPullRefreshing(false);
      setPullDownDistance(0);
    }
  };

  const handleFeedTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (currentTab !== 'home' || isPullRefreshing) return;
    if (feedScrollRef.current && feedScrollRef.current.scrollTop <= 2) {
      pullStartYRef.current = e.touches[0].clientY;
      setIsPullDragging(true);
    }
  };

  const handleFeedTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pullStartYRef.current === null || isPullRefreshing || currentTab !== 'home') return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - pullStartYRef.current;

    if (diff > 0 && feedScrollRef.current && feedScrollRef.current.scrollTop <= 2) {
      const dampened = Math.min(Math.pow(diff, 0.82) * 1.8, 88);
      setPullDownDistance(dampened);
    } else {
      setPullDownDistance(0);
    }
  };

  const handleFeedTouchEnd = () => {
    if (pullStartYRef.current !== null) {
      pullStartYRef.current = null;
      setIsPullDragging(false);
      if (pullDownDistance >= PULL_THRESHOLD && !isPullRefreshing) {
        void executeRefreshFeed();
      } else {
        setPullDownDistance(0);
      }
    }
  };

  const handleFeedMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTab !== 'home' || isPullRefreshing) return;
    if (feedScrollRef.current && feedScrollRef.current.scrollTop <= 2) {
      pullStartYRef.current = e.clientY;
      setIsPullDragging(true);
    }
  };

  const handleFeedMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pullStartYRef.current === null || isPullRefreshing || currentTab !== 'home') return;
    const currentY = e.clientY;
    const diff = currentY - pullStartYRef.current;

    if (diff > 0 && feedScrollRef.current && feedScrollRef.current.scrollTop <= 2) {
      const dampened = Math.min(Math.pow(diff, 0.82) * 1.8, 88);
      setPullDownDistance(dampened);
    } else {
      setPullDownDistance(0);
    }
  };

  const handleFeedMouseUp = () => {
    if (pullStartYRef.current !== null) {
      pullStartYRef.current = null;
      setIsPullDragging(false);
      if (pullDownDistance >= PULL_THRESHOLD && !isPullRefreshing) {
        void executeRefreshFeed();
      } else {
        setPullDownDistance(0);
      }
    }
  };

  // Horizontal swipe-to-navigate in Reels view (Swipe Left -> Profile, Swipe Right -> Feed)
  const [reelSwipeStartX, setReelSwipeStartX] = useState<number | null>(null);
  const [reelSwipeStartY, setReelSwipeStartY] = useState<number | null>(null);
  const [reelSwipeDeltaX, setReelSwipeDeltaX] = useState<number>(0);
  const [isSwipingReels, setIsSwipingReels] = useState(false);

  const handleReelsTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ('button' in e && e.button !== 0) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setReelSwipeStartX(clientX);
    setReelSwipeStartY(clientY);
    setReelSwipeDeltaX(0);
    setIsSwipingReels(true);
  };

  const handleReelsTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isSwipingReels || reelSwipeStartX === null || reelSwipeStartY === null) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diffX = clientX - reelSwipeStartX;
    const diffY = clientY - reelSwipeStartY;

    // Engaged when horizontal movement is greater than vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
      setReelSwipeDeltaX(diffX);
    }
  };

  const handleReelsTouchEnd = () => {
    if (!isSwipingReels) return;
    setIsSwipingReels(false);

    // If swipe threshold passed (> 50px)
    if (reelSwipeDeltaX < -50) {
      // SWIPE LEFT: Navigate to Profile page
      showToast('Swiped to Profile');
      setCurrentTab('profile');
    } else if (reelSwipeDeltaX > 50) {
      // SWIPE RIGHT: Return to Feed
      showToast('Returned to Feed');
      setCurrentTab('home');
    }

    setReelSwipeDeltaX(0);
    setReelSwipeStartX(null);
    setReelSwipeStartY(null);
  };

  const handleToggleReelLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );
  };

  const handleToggleReelSave = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextSaved = !r.isSaved;
          showToast(nextSaved ? 'Saved Reel to your collection' : 'Removed Reel from saved');
          return {
            ...r,
            isSaved: nextSaved,
            bookmarksCount: nextSaved ? r.bookmarksCount + 1 : Math.max(0, r.bookmarksCount - 1),
          };
        }
        return r;
      })
    );
  };

  const handleToggleFollow = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextFollow = !r.isFollowing;
          showToast(nextFollow ? `Following ${r.author}` : `Unfollowed ${r.author}`);
          return { ...r, isFollowing: nextFollow };
        }
        return r;
      })
    );
  };

  const handleReelDoubleClick = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId && !r.isLiked ? { ...r, isLiked: true, likesCount: r.likesCount + 1 } : r))
    );
    setHeartPopReelId(reelId);
    setTimeout(() => setHeartPopReelId(null), 900);
  };

  const handleTogglePlayPause = (reelId: string) => {
    setPausedReels((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createBody.trim() && !createTitle.trim()) {
      showToast('Please write something to post.');
      return;
    }

    const gradientPresets = [
      shadowGradients.mainFeed,
      shadowGradients.softPastel,
      shadowGradients.deepMoody,
      shadowGradients.tealCyan,
      shadowGradients.warmBronze,
    ];

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      authorName: currentUser.name,
      username: currentUser.name.toLowerCase().replace(/\s+/g, '.'),
      avatarGradient: ['#242424', '#141414'],
      timeAgo: 'Just now',
      imageGradient: gradientPresets[selectedGradientIndex] as any,
      content: createBody.trim() || 'Shared via Shadow Mobile',
      captionTitle: createTitle.trim() || 'NEW POST',
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      isSaved: false,
    };

    setFeedPosts([newPost, ...feedPosts]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setCreateTitle('');
    setCreateBody('');
    setCurrentTab('home');
    showToast('Successfully posted to Shadow feed!');
  };

  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 z-50 px-4 py-2 bg-gradient-to-r from-black to-neutral-900 text-white text-xs font-bold rounded-full shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles size={14} />
          {toastMsg}
        </div>
      )}

      {/* Concept Phone Frame */}
      <div
        className="w-full max-w-[420px] min-h-[780px] h-[830px] rounded-[52px] p-3 shadow-[0_25px_65px_-15px_rgba(0,0,0,0.85)] border-[7px] border-[#181818] flex flex-col relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#12131A' : '#F4F5F7' }}
      >
        {/* Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#05060A] rounded-full z-40 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#181926] mr-3" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#10111A]" />
        </div>

        {/* Chassis Screen Content */}
        <div
          className="flex-1 rounded-[42px] overflow-hidden flex flex-col relative transition-colors duration-300"
          style={{ backgroundColor: colors.background, color: colors.text }}
        >
          {/* Status Bar */}
          <div
            className={`h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold select-none shrink-0 z-40 transition-colors ${
              currentTab === 'reels' ? 'absolute top-0 left-0 right-0 text-white pointer-events-none drop-shadow-md' : ''
            }`}
            style={{ color: currentTab === 'reels' ? '#FFFFFF' : colors.text }}
          >
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div
                className="w-5 h-2.5 border rounded-[3px] p-0.5 flex items-center"
                style={{ borderColor: colors.text }}
              >
                <div
                  className="w-full h-full rounded-[1px]"
                  style={{ backgroundColor: colors.text }}
                />
              </div>
            </div>
          </div>

          {/* 3. REELS SCREEN (TRUE 100% MAXIMUM FULL-SCREEN IMMERSIVE VERTICAL VIDEO WITH HORIZONTAL SWIPE NAVIGATION) */}
          {currentTab === 'reels' && (
            <div
              ref={reelsScrollRef}
              onScroll={handleReelsScroll}
              onTouchStart={handleReelsTouchStart}
              onTouchMove={handleReelsTouchMove}
              onTouchEnd={handleReelsTouchEnd}
              onMouseDown={handleReelsTouchStart}
              onMouseMove={handleReelsTouchMove}
              onMouseUp={handleReelsTouchEnd}
              onMouseLeave={() => {
                if (isSwipingReels) {
                  setIsSwipingReels(false);
                  setReelSwipeDeltaX(0);
                  setReelSwipeStartX(null);
                  setReelSwipeStartY(null);
                }
              }}
              className="absolute inset-0 z-10 snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-black cursor-grab active:cursor-grabbing"
              style={{
                transform: isSwipingReels && Math.abs(reelSwipeDeltaX) > 8 ? `translateX(${reelSwipeDeltaX * 0.35}px)` : undefined,
                transition: isSwipingReels ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            >
              {/* Swipe Right Visual Cue: Return to Feed */}
              {isSwipingReels && reelSwipeDeltaX > 20 && (
                <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-2 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95">
                  <ChevronLeft size={16} className="text-white" />
                  <span>Return to Feed</span>
                </div>
              )}

              {/* Swipe Left Visual Cue: View Profile */}
              {isSwipingReels && reelSwipeDeltaX < -20 && (
                <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/20 flex items-center gap-2 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95">
                  <span>View Profile</span>
                  <ChevronRight size={16} className="text-white" />
                </div>
              )}

              {reels.map((reel) => {
                const isPaused = !!pausedReels[reel.id];
                const isHeartPopping = heartPopReelId === reel.id;

                return (
                  <div
                    key={reel.id}
                    className="w-full h-full snap-start snap-always relative shrink-0 overflow-hidden flex flex-col justify-between select-none"
                    style={{
                      background: `linear-gradient(135deg, ${reel.gradient.join(', ')})`,
                    }}
                    onDoubleClick={() => handleReelDoubleClick(reel.id)}
                  >
                    {/* Ambient subtle animated shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

                    {/* Central Play/Pause Tap Target */}
                    <div
                      onClick={() => handleTogglePlayPause(reel.id)}
                      className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                    >
                      {isPaused && (
                        <div className="w-16 h-16 rounded-[16px] bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 shadow-2xl animate-scale-in border border-white/20">
                          <Play size={28} className="translate-x-0.5 fill-white text-white" />
                        </div>
                      )}

                      {/* Double tap heart pop animation */}
                      {isHeartPopping && (
                        <div className="absolute flex items-center justify-center animate-ping pointer-events-none">
                          <Heart size={90} className="fill-white text-white drop-shadow-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Top Floating Overlay (Reels Header & Controls) */}
                    <div className="relative z-20 pt-11 px-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-6 pointer-events-auto">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl font-extrabold text-white tracking-tight drop-shadow-md">
                          Reels
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                            showToast(isMuted ? 'Sound unmuted' : 'Sound muted');
                          }}
                          className="w-8 h-8 rounded-[10px] bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('Camera launched for new Reel');
                          }}
                          className="w-8 h-8 rounded-[10px] bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                          title="Record Reel"
                        >
                          <Camera size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom-Left Information Overlay */}
                    <div className="relative z-20 pb-16 px-4 flex items-end justify-between pointer-events-auto">
                      <div className="flex flex-col gap-2 max-w-[72%] text-white">
                        {/* Author row */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-[11px] p-0.5 flex items-center justify-center shadow-lg"
                            style={{
                              background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                            }}
                          >
                            <div
                              className="w-full h-full rounded-[9px] flex items-center justify-center text-[11px] font-extrabold text-white"
                              style={{
                                background: `linear-gradient(135deg, ${reel.avatarGradient.join(', ')})`,
                              }}
                            >
                              {reel.author[0]}
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-white drop-shadow-sm">
                                {reel.author}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFollow(reel.id);
                                }}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                                  reel.isFollowing
                                    ? 'bg-white/20 border-white/30 text-white'
                                    : 'bg-black text-white hover:bg-neutral-800 shadow-sm border-white/20'
                                }`}
                              >
                                {reel.isFollowing ? 'Following' : 'Follow'}
                              </button>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-white/80">
                              <MapPin size={10} className="text-white" />
                              <span>{reel.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Caption & Tags */}
                        <p className="text-xs text-white/95 leading-relaxed drop-shadow-sm">
                          {reel.caption}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {reel.tags.map((tag: string) => (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast(`Explore tag ${tag}`);
                              }}
                              className="text-[10px] font-semibold text-white hover:text-white cursor-pointer drop-shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Music Audio Ticker */}
                        <div className="flex items-center gap-2 mt-0.5 py-1 px-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 self-start text-[10px] text-white/90">
                          <Music size={11} className="text-white animate-pulse shrink-0" />
                          <span className="truncate max-w-[190px] font-medium">
                            {reel.audioTrack}
                          </span>
                        </div>
                      </div>

                      {/* Right Action Stack */}
                      <div className="flex flex-col items-center gap-3 text-white pb-2">
                        {/* Like Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleReelLike(reel.id);
                          }}
                          className="flex flex-col items-center gap-0.5 group"
                        >
                          <div
                            className={`w-11 h-11 rounded-[14px] backdrop-blur-md border flex items-center justify-center transition-all group-active:scale-90 ${
                              reel.isLiked
                                ? 'bg-white/10 border-white/20 shadow-lg shadow-black'
                                : 'bg-black/45 border-white/15 hover:bg-black/60'
                            }`}
                          >
                            <Heart
                              size={21}
                              className={
                                reel.isLiked
                                  ? 'fill-white text-white scale-110'
                                  : 'text-white group-hover:scale-110 transition-transform'
                              }
                            />
                          </div>
                          <span className="text-[11px] font-extrabold drop-shadow-md">
                            {reel.likesCount.toLocaleString()}
                          </span>
                        </button>

                        {/* Comments Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReelComments(reel);
                          }}
                          className="flex flex-col items-center gap-0.5 group"
                        >
                          <div className="w-11 h-11 rounded-[14px] bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/60 transition-all group-active:scale-90">
                            <MessageCircle size={21} className="text-white group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-[11px] font-extrabold drop-shadow-md">
                            {reel.commentsCount}
                          </span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleReelSave(reel.id);
                          }}
                          className="flex flex-col items-center gap-0.5 group"
                        >
                          <div
                            className={`w-11 h-11 rounded-[14px] backdrop-blur-md border flex items-center justify-center transition-all group-active:scale-90 ${
                              reel.isSaved
                                ? 'bg-white/10 border-white/20 shadow-lg shadow-black'
                                : 'bg-black/45 border-white/15 hover:bg-black/60'
                            }`}
                          >
                            <Bookmark
                              size={20}
                              className={
                                reel.isSaved
                                  ? 'fill-white text-white scale-110'
                                  : 'text-white group-hover:scale-110 transition-transform'
                              }
                            />
                          </div>
                          <span className="text-[11px] font-extrabold drop-shadow-md">
                            {reel.bookmarksCount}
                          </span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator?.clipboard?.writeText?.(window.location.href);
                            showToast('Reel link copied to clipboard!');
                          }}
                          className="flex flex-col items-center gap-0.5 group"
                        >
                          <div className="w-11 h-11 rounded-[14px] bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-black/60 transition-all group-active:scale-90">
                            <Send size={19} className="text-white -rotate-12 group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-[11px] font-extrabold drop-shadow-md">
                            Share
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Circular Progress Indicator Overlaying Bottom Right Corner */}
                    <div className="absolute right-4 bottom-14 z-30 pointer-events-auto">
                      <ReelCircularProgress
                        isActive={currentTab === 'reels'}
                        isPlaying={!isPaused}
                        onTogglePlayPause={() => handleTogglePlayPause(reel.id)}
                        onToast={showToast}
                        reelId={reel.id}
                        className="!relative !right-0 !bottom-0"
                      />
                    </div>

                    {/* Progress Bar at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                      <div className="h-full bg-gradient-to-r from-black via-neutral-900 to-neutral-900 w-2/3 animate-pulse" />
                    </div>
                  </div>
                );
              })}

              {/* Endless Reels Snap Loader Card */}
              {isLoadingMoreReels && (
                <div className="w-full h-full snap-start snap-always relative shrink-0 overflow-hidden flex flex-col items-center justify-center bg-black gap-3 text-white select-none">
                  <div
                    className="w-12 h-12 rounded-2xl p-0.5 shadow-lg shadow-black flex items-center justify-center animate-pulse"
                    style={{
                      background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                    }}
                  >
                    <div className="w-full h-full rounded-[14px] bg-[#0F111D] flex items-center justify-center">
                      <span className="font-shadow-script text-2xl text-white">S</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-transparent animate-spin" />
                    Loading next Reel...
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MAIN SCREEN SWITCHER (For Home, Explore, Create, Notifications, Profile) */}
          {currentTab !== 'reels' && (
            <div
              ref={feedScrollRef}
              onScroll={handleFeedScroll}
              onTouchStart={handleFeedTouchStart}
              onTouchMove={handleFeedTouchMove}
              onTouchEnd={handleFeedTouchEnd}
              onMouseDown={handleFeedMouseDown}
              onMouseMove={handleFeedMouseMove}
              onMouseUp={handleFeedMouseUp}
              onMouseLeave={handleFeedMouseUp}
              className="flex-1 overflow-y-auto no-scrollbar pb-20"
            >
            {isViewingMyShadow ? (
              <MyShadowScreen
                onBack={() => setIsViewingMyShadow(false)}
                isDark={isDark}
                currentUser={{
                  name: currentUser.name,
                  username: currentUser.username,
                  shadowId: currentUser.shadowId,
                  rank: currentUser.shadowRank,
                  isVerified: currentUser.verification === 'VERIFIED',
                  avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                }}
                onToast={(msg) => showToast(msg)}
              />
            ) : (
              <>
            {/* 1. HOME SCREEN (Real Feed + Concept Stories & Visual PostCards) */}
            {currentTab === 'home' && (
              <div>
                {/* Concept Shadow Header with Cursive Wordmark */}
                <div
                  className="h-14 px-5 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md"
                  style={{ backgroundColor: colors.background + 'EE' }}
                >
                  {/* Left Action: Direct Shadow Navigation Tab Icon on Home Feed */}
                  <button
                    onClick={() => setIsViewingMyShadow(true)}
                    className="relative group p-0.5 rounded-full transition-transform active:scale-90 cursor-pointer"
                    title="My Shadow Dashboard"
                    aria-label="Open My Shadow directly from Home Feed"
                  >
                    <div
                      className="w-9 h-9 rounded-full p-[1.5px] shadow-md shadow-black flex items-center justify-center transition-all group-hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: colors.background }}
                      >
                        <span className="text-sm font-bold text-white">♙</span>
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white/10 border-2 border-[#0B0C14] shadow-xs" />
                  </button>

                  <h1
                    className="font-shadow-script text-3xl font-semibold tracking-wide select-none"
                    style={{ color: colors.text }}
                  >
                    Shadow
                  </h1>

                  <div className="flex items-center gap-2">
                    {/* Header Manual Refresh Button */}
                    <button
                      onClick={() => void executeRefreshFeed()}
                      disabled={isPullRefreshing}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 active:scale-95 transition-all cursor-pointer"
                      style={{ backgroundColor: colors.inputBackground }}
                      title="Fetch latest posts"
                      aria-label="Refresh feed"
                    >
                      <RotateCw
                        size={14}
                        className={`text-white transition-all ${isPullRefreshing ? 'animate-spin' : ''}`}
                      />
                    </button>

                    <button
                      onClick={onToggleTheme}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: colors.inputBackground }}
                    >
                      {isDark ? (
                        <Sun size={15} className="text-white" />
                      ) : (
                        <Moon size={15} className="text-white" />
                      )}
                    </button>

                    <button
                      onClick={() => setCurrentTab('notifications')}
                      className="relative w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <Heart size={20} style={{ color: colors.text }} />
                      {unreadNotifsCount > 0 && (
                        <span
                          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white"
                          style={{ backgroundColor: colors.badgeBackground }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* TOP PULL-TO-REFRESH VISUAL ACCORDION */}
                <div
                  style={{
                    height: isPullRefreshing ? 54 : pullDownDistance,
                    opacity: pullDownDistance > 6 || isPullRefreshing ? 1 : 0,
                    transition: isPullDragging ? 'none' : 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                  className="overflow-hidden flex items-center justify-center select-none relative z-10"
                >
                  <div
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-md backdrop-blur-md transition-transform"
                    style={{
                      backgroundColor: isDark ? 'rgba(24, 26, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: isPullRefreshing ? '#7B52B9' : colors.border,
                      boxShadow: isPullRefreshing ? '0 0 16px rgba(123, 82, 185, 0.35)' : undefined,
                      transform: `scale(${Math.min(0.7 + (pullDownDistance / PULL_THRESHOLD) * 0.3, 1)})`,
                    }}
                  >
                    {isPullRefreshing ? (
                      <RotateCw size={15} className="animate-spin text-white" />
                    ) : (
                      <ArrowDown
                        size={15}
                        className="text-white transition-transform duration-200"
                        style={{
                          transform: `rotate(${pullDownDistance >= PULL_THRESHOLD ? 180 : (pullDownDistance / PULL_THRESHOLD) * 180}deg)`,
                        }}
                      />
                    )}
                    <span
                      className="text-xs font-semibold"
                      style={{ color: colors.text }}
                    >
                      {isPullRefreshing
                        ? 'Fetching latest posts...'
                        : pullDownDistance >= PULL_THRESHOLD
                        ? 'Release to refresh feed'
                        : 'Pull down to refresh'}
                    </span>
                  </div>
                </div>

                {/* Concept Story Carousel */}
                <div className="py-2 px-4 border-b overflow-x-auto no-scrollbar flex items-center gap-3" style={{ borderColor: colors.border }}>
                  {INITIAL_STORIES.map((story) => (
                    <div
                      key={story.id}
                      className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                      onClick={() => showToast(`Viewing story by ${story.username}`)}
                    >
                      <div
                        className="w-16 h-16 rounded-[20px] p-0.5 shadow-md flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${story.gradient.join(', ')})`,
                        }}
                      >
                        <div
                          className="w-full h-full rounded-[18px] p-0.5 flex items-center justify-center"
                          style={{ backgroundColor: colors.background }}
                        >
                          <div
                            className="w-full h-full rounded-[16px] flex items-center justify-center text-white text-xs font-bold"
                            style={{
                              background: `linear-gradient(135deg, ${story.gradient.join(', ')})`,
                            }}
                          >
                            {story.isCurrentUser ? '+' : story.username[0].toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium truncate w-16 text-center" style={{ color: colors.secondaryText }}>
                        {story.username}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Real Feed Posts Styled with Concept Cards */}
                <div className="p-4 space-y-5">
                  {feedPosts.map((post) => (
                    <div key={post.id} className="relative">
                      {/* Middle Layer — Card Behind the Feed (exact same card background colour token) */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 translate-y-2 scale-[0.97] rounded-3xl pointer-events-none shadow-md"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.cardBorder,
                        }}
                      />
                      <div
                        className="relative z-10 rounded-3xl overflow-hidden shadow-lg border transition-all"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.cardBorder,
                        }}
                      >
                      {/* Post Header */}
                      <div className="p-3.5 flex items-center justify-between">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer"
                          onClick={() => setCurrentTab('profile')}
                        >
                          <div
                            className="w-9 h-9 rounded-[11px] p-0.5 flex items-center justify-center"
                            style={{
                              background: `linear-gradient(135deg, ${post.avatarGradient.join(', ')})`,
                            }}
                          >
                            <div
                              className="w-full h-full rounded-[9px] flex items-center justify-center text-white text-xs font-extrabold"
                              style={{
                                background: `linear-gradient(135deg, ${post.avatarGradient.join(', ')})`,
                              }}
                            >
                              {post.authorName[0]}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-bold block" style={{ color: colors.text }}>
                              {post.username}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px]" style={{ color: colors.secondaryText }}>
                                {post.timeAgo}
                              </span>
                              {post.shadowEncounter && (
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-white">
                                  <span>·</span>
                                  <span>📍 {post.shadowEncounter.location.placeName}</span>
                                  <span className={`px-1.5 py-0.2 rounded-full text-[8.5px] font-bold ${
                                    post.shadowEncounter.validationStatus === 'verified'
                                      ? 'bg-white/10 text-white'
                                      : 'bg-white/10 text-white'
                                  }`}>
                                    {post.shadowEncounter.validationStatus.toUpperCase()}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedSharePost(post)}
                          className="p-1.5 hover:opacity-75"
                          style={{ color: colors.text }}
                        >
                          <Send size={16} />
                        </button>
                      </div>

                      {/* Cinematic Gradient Media Card with Post Content */}
                      <div className="px-3">
                        <div
                          className="w-full h-64 rounded-2xl p-4 flex flex-col justify-end shadow-inner relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${post.imageGradient.join(', ')})`,
                          }}
                        >
                          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                            {post.captionTitle && (
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white block mb-1">
                                {post.captionTitle}
                              </span>
                            )}
                            <p className="text-xs text-white leading-relaxed font-medium">
                              {post.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleLike(post.id)}
                            className="flex items-center gap-1 hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Heart
                              size={20}
                              className={post.isLiked ? 'fill-[#7B52B9] text-white' : ''}
                              style={{ color: post.isLiked ? '#7B52B9' : colors.text }}
                            />
                          </button>

                          <button
                            onClick={() => showToast('Opening post comments...')}
                            className="hover:scale-110 active:scale-95 transition-transform"
                          >
                            <MessageCircle size={20} style={{ color: colors.text }} />
                          </button>

                          <button
                            onClick={() => setSelectedSharePost(post)}
                            className="hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Share2 size={19} style={{ color: colors.text }} />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setFeedPosts((prev) =>
                              prev.map((p) =>
                                p.id === post.id ? { ...p, isSaved: !p.isSaved } : p
                              )
                            );
                            showToast(post.isSaved ? 'Removed from saved items' : 'Saved to your collection');
                          }}
                          className="hover:scale-110 active:scale-95 transition-transform"
                        >
                          <Bookmark
                            size={20}
                            className={post.isSaved ? 'fill-white' : ''}
                            style={{ color: colors.text }}
                          />
                        </button>
                      </div>

                      {/* Likes Count & Text */}
                      <div className="px-4 pb-3 pt-1">
                        <span className="text-xs font-bold block" style={{ color: colors.text }}>
                          {post.likesCount.toLocaleString()} likes
                        </span>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>

                {/* Endless Feed Dynamic Loading Indicator */}
                {isLoadingMoreFeed && (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
                    <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span className="text-[11px] font-semibold" style={{ color: colors.secondaryText }}>
                      Loading more Shadow moments...
                    </span>
                  </div>
                )}

                {/* Pull Up to Refresh Feed */}
                <div className="pt-2 pb-4 flex justify-center">
                  <PullUpRefresh
                    onRefresh={executeRefreshFeed}
                    isRefreshing={isPullRefreshing}
                    isDark={isDark}
                    label="Pull up to refresh feed"
                  />
                </div>
              </div>
            )}

            {/* 2. EXPLORE SCREEN (Concept Asymmetric Grid) */}
            {currentTab === 'explore' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold" style={{ color: colors.text }}>
                    Explore
                  </h2>
                  <button
                    onClick={onToggleTheme}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.inputBackground }}
                  >
                    {isDark ? <Sun size={15} className="text-white" /> : <Moon size={15} />}
                  </button>
                </div>

                {/* Concept Search Bar */}
                <div
                  className="rounded-2xl px-3.5 py-2.5 flex items-center gap-2 border"
                  style={{ backgroundColor: colors.inputBackground, borderColor: colors.border }}
                >
                  <Search size={16} style={{ color: colors.secondaryText }} />
                  <input
                    type="text"
                    placeholder="Search creators, topics, or campus..."
                    className="w-full text-xs bg-transparent focus:outline-none"
                    style={{ color: colors.text }}
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {EXPLORE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => showToast(`Filtering by ${cat.title}`)}
                        className="px-3 py-1.5 rounded-full border flex items-center gap-2 shrink-0 transition-all hover:opacity-90"
                        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${cat.gradient.join(', ')})`,
                          }}
                        >
                          <Icon size={11} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: colors.text }}>
                          {cat.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Staggered Media Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {EXPLORE_CARDS.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => showToast(`Exploring ${card.title}`)}
                      className="rounded-2xl p-3 flex flex-col justify-end shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
                      style={{
                        height: card.height,
                        background: `linear-gradient(135deg, ${card.gradient.join(', ')})`,
                      }}
                    >
                      <span className="text-xs font-extrabold text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg self-start">
                        {card.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CREATE SCREEN (Concept Media Composer Wired to Real Post Action) */}
            {currentTab === 'create' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="text-xs font-semibold hover:opacity-80"
                    style={{ color: colors.secondaryText }}
                  >
                    Cancel
                  </button>
                  <h2 className="text-base font-bold" style={{ color: colors.text }}>
                    Create Post
                  </h2>
                  <button
                    onClick={handleCreatePost}
                    className="text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-md hover:opacity-95"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Publish
                  </button>
                </div>

                {/* Media Preview Card */}
                <div
                  className="w-full h-44 rounded-2xl p-4 flex flex-col justify-end shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${[
                      shadowGradients.mainFeed,
                      shadowGradients.softPastel,
                      shadowGradients.deepMoody,
                      shadowGradients.tealCyan,
                      shadowGradients.warmBronze,
                    ][selectedGradientIndex].join(', ')})`,
                  }}
                >
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-2.5">
                    <span className="text-[11px] font-bold text-white block">
                      {createTitle.trim() || 'TITLE PREVIEW'}
                    </span>
                    <span className="text-[10px] text-slate-200 block truncate">
                      {createBody.trim() || 'Write your content below to preview...'}
                    </span>
                  </div>
                </div>

                {/* Palette Selector */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-2" style={{ color: colors.secondaryText }}>
                    Visual Gradient
                  </label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['Cyber Violet', 'Pastel Dusk', 'Moody Blue', 'Teal Aurora', 'Bronze'].map(
                      (name, i) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setSelectedGradientIndex(i)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            selectedGradientIndex === i
                              ? 'border-white/20 bg-white/10 text-white'
                              : isDark
                              ? 'border-white/10 text-[#8E92A0] hover:text-white'
                              : 'border-[#E0E1E2] text-[#767676] bg-[#F7F8FA] hover:text-[#1B1C1D]'
                          }`}
                        >
                          {name}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5" style={{ color: colors.secondaryText }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="Featured title..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  />
                </div>

                {/* Description Body Input */}
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider block mb-1.5" style={{ color: colors.secondaryText }}>
                    Content / Description
                  </label>
                  <textarea
                    rows={4}
                    value={createBody}
                    onChange={(e) => setCreateBody(e.target.value)}
                    placeholder="What are you creating or sharing on campus today?..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none resize-none"
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  />
                </div>
              </div>
            )}

            {/* 5. NOTIFICATIONS SCREEN (Concept Activity Center) */}
            {currentTab === 'notifications' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold" style={{ color: colors.text }}>
                    Notifications
                  </h2>
                  <button
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                      showToast('All marked as read');
                    }}
                    className="text-xs font-bold text-white hover:underline cursor-pointer"
                  >
                    Mark as read
                  </button>
                </div>

                <div className="space-y-2.5">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                        );
                      }}
                      className="p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors"
                      style={{
                        backgroundColor: notif.unread ? colors.surface : colors.inputBackground,
                        borderColor: notif.unread ? colors.accent + '40' : colors.border,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${notif.gradient.join(', ')})`,
                          }}
                        >
                          {notif.user[0]}
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: colors.text }}>
                            <strong className="font-bold">{notif.user}</strong> {notif.action}
                          </p>
                          <span className="text-[10px]" style={{ color: colors.secondaryText }}>
                            {notif.time}
                          </span>
                        </div>
                      </div>

                      {notif.unread && (
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: colors.accent }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PROFILE SCREEN (Concept Layout + Real Shadow Identity & User Data) */}
            {currentTab === 'profile' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTabChange('create')}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ borderColor: colors.border, borderWidth: 1 }}
                      title="Create Post (+)"
                      aria-label="Create Post"
                    >
                      <Plus size={16} style={{ color: colors.text }} />
                    </button>
                    <h2 className="text-xl font-extrabold" style={{ color: colors.text }}>
                      Profile
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onToggleTheme}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.inputBackground }}
                    >
                      {isDark ? <Sun size={15} className="text-white" /> : <Moon size={15} />}
                    </button>
                    <button
                      onClick={() => {
                        showToast('Logged out');
                        setIsAuthenticated(false);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/10"
                      title="Log out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>

                {/* Profile Header Avatar Section */}
                <div className="flex flex-col items-center text-center pt-2">
                  <div
                    className="w-20 h-20 rounded-[26px] p-1 shadow-xl flex items-center justify-center mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[22px] p-1 flex items-center justify-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <div
                        className="w-full h-full rounded-[19px] flex items-center justify-center text-white text-xl font-extrabold"
                        style={{
                          background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                        }}
                      >
                        {currentUser.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                    {currentUser.name}
                  </h3>
                  <span className="text-xs font-semibold text-white mt-0.5">
                    {currentUser.email}
                  </span>
                  <p className="text-xs mt-1 max-w-xs" style={{ color: colors.secondaryText }}>
                    {currentUser.bio}
                  </p>

                  {/* Real Shadow Identity Card */}
                  <div
                    className="w-full mt-3.5 p-3 rounded-[24px] border"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b" style={{ borderColor: colors.border }}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                        <span className="text-[10px] font-extrabold tracking-wider uppercase" style={{ color: colors.secondaryText }}>
                          Shadow Identity
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-md border ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-[#F4F5F7] border-[#E0E1E2]'
                        }`}
                        style={{ color: colors.text }}
                      >
                        <span className="text-white font-bold">ID:</span>
                        <span>{currentUser.shadowId}</span>
                      </div>
                    </div>

                    {/* Primary Premium Status Indicator: Distinct Proportional Rank Badge with Visual Transition */}
                    <div className="mb-2.5">
                      <PawnRankBadge
                        rank={currentUser.shadowRank as any}
                        variant="profile"
                        isDark={isDark}
                        isPromoting={isPromotingRank}
                        onClick={(e) => handleToggleUserRank(e)}
                      />
                    </div>

                    {/* Secondary Row: Verification & Authority + Rank Elevation Toggle */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t" style={{ borderColor: colors.border }}>
                      <button
                        onClick={(e) => handleToggleUserRank(e)}
                        disabled={isPromotingRank}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9.5px] font-extrabold transition-all cursor-pointer active:scale-95 ${
                          currentUser.shadowRank === 'PAWN'
                            ? isDark
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-white/10 border-white/20 text-[#6435C9]'
                            : isDark
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-neutral-800 border-white/20 text-white'
                        } ${isPromotingRank ? 'scale-105 ring-2 ring-[#7B52B9]/50 shadow-sm' : ''}`}
                        title="Simulate Shadow Rank Progression: PAWN ↔ KNIGHT"
                      >
                        <Sparkles size={11} className={isPromotingRank ? 'animate-spin text-white' : currentUser.shadowRank === 'PAWN' ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-white' : 'text-white')} />
                        <span>{currentUser.shadowRank === 'PAWN' ? 'Elevate to KNIGHT' : 'Revert to PAWN'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const nextStatus = currentUser.verification === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
                          setCurrentUser((prev) => ({ ...prev, verification: nextStatus }));
                          showToast(`Verification: ${nextStatus} (Rank stays PAWN)`);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                          currentUser.verification === 'VERIFIED'
                            ? isDark
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-white/10 border-white/20 text-white'
                            : isDark
                              ? 'bg-white/10 border-white/20 text-white'
                              : 'bg-white/10 border-white/20 text-white'
                        }`}
                        title="Independent Verification Status - Click to toggle"
                      >
                        {currentUser.verification === 'VERIFIED' ? (
                          <ShieldCheck size={12} />
                        ) : (
                          <ShieldAlert size={12} />
                        )}
                        <span className="text-[9.5px] font-extrabold tracking-wider">
                          {currentUser.verification}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-around w-full mt-4 py-2">
                    <div>
                      <span className="text-base font-extrabold block" style={{ color: colors.text }}>
                        {currentUser.postsCount}
                      </span>
                      <span className="text-[10px] uppercase font-bold" style={{ color: colors.secondaryText }}>
                        Posts
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-extrabold block" style={{ color: colors.text }}>
                        {currentUser.followersCount}
                      </span>
                      <span className="text-[10px] uppercase font-bold" style={{ color: colors.secondaryText }}>
                        Followers
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-extrabold block" style={{ color: colors.text }}>
                        {currentUser.followingCount}
                      </span>
                      <span className="text-[10px] uppercase font-bold" style={{ color: colors.secondaryText }}>
                        Following
                      </span>
                    </div>
                  </div>

                  {/* Action Follow/Edit + Create Post Button */}
                  <div className="flex items-center gap-2 w-full mt-3">
                    <button
                      onClick={() => showToast('Profile updated')}
                      className="flex-1 py-2.5 rounded-full font-bold text-xs bg-black text-white hover:bg-neutral-800 shadow-md transition-transform active:scale-95 cursor-pointer"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => handleTabChange('create')}
                      className="px-4 py-2.5 rounded-full font-bold text-xs border border-white/20 text-white bg-white/10 hover:bg-black/25 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      title="Create Post (+)"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      <span>Post</span>
                    </button>
                  </div>
                </div>

                {/* Highlights */}
                <div className="pt-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-2" style={{ color: colors.secondaryText }}>
                    Highlights
                  </span>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    {['Best shots', 'My travels', 'Autumn', 'Food'].map((title, i) => (
                      <div key={title} className="flex flex-col items-center gap-1 shrink-0">
                        <div
                          className="w-14 h-14 rounded-[18px] p-0.5"
                          style={{
                            background: 'linear-gradient(135deg, #2A2A2A 0%, #161616 100%)',
                          }}
                        >
                          <div
                            className="w-full h-full rounded-[16px] flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: colors.background }}
                          >
                            {title[0]}
                          </div>
                        </div>
                        <span className="text-[10px]" style={{ color: colors.secondaryText }}>
                          {title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </>
          )}
        </div>
        )}

          {/* 7. FLOATING 5-DESTINATION CONCEPT BOTTOM NAVIGATION (Scroll-Responsive Sizing) */}
          <div
            className={`absolute left-0 right-0 z-30 flex justify-center pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCompactNav ? 'bottom-2' : 'bottom-3'
            }`}
          >
            <div
              className={`pointer-events-auto rounded-full border flex items-center justify-around transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl ${
                isCompactNav
                  ? 'h-10 w-[272px] px-2.5 shadow-lg'
                  : 'h-14 w-[355px] px-4 shadow-2xl'
              }`}
              style={{
                backgroundColor: currentTab === 'reels'
                  ? (isCompactNav ? 'rgba(12, 14, 22, 0.88)' : 'rgba(12, 14, 22, 0.94)')
                  : (isDark
                      ? (isCompactNav ? 'rgba(18, 20, 32, 0.88)' : 'rgba(18, 20, 32, 0.94)')
                      : (isCompactNav ? 'rgba(255, 255, 255, 0.90)' : 'rgba(255, 255, 255, 0.95)')),
                borderColor: currentTab === 'reels' ? 'rgba(255, 255, 255, 0.16)' : colors.border,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Home */}
              <button
                onClick={() => handleTabChange('home')}
                className="flex flex-col items-center justify-center p-1.5 relative hover:opacity-80 transition-opacity"
              >
                <span
                  className={`font-semibold leading-none transition-all duration-300 ${
                    isCompactNav ? 'text-base' : 'text-xl'
                  }`}
                  style={{
                    color: currentTab === 'home'
                      ? colors.tabActive
                      : (currentTab === 'reels' ? '#94A3B8' : colors.tabInactive),
                  }}
                >
                  ⌂
                </span>
                {currentTab === 'home' && (
                  <div
                    className={`rounded-full absolute bottom-0.5 transition-all duration-300 ${
                      isCompactNav ? 'w-2 h-0.5' : 'w-3 h-0.5'
                    }`}
                    style={{ backgroundColor: colors.text }}
                  />
                )}
              </button>

              {/* Explore */}
              <button
                onClick={() => handleTabChange('explore')}
                className="flex flex-col items-center justify-center p-1.5 relative hover:opacity-80 transition-opacity"
              >
                <Search
                  size={isCompactNav ? 16 : 19}
                  className="transition-all duration-300"
                  style={{
                    color: currentTab === 'explore'
                      ? colors.tabActive
                      : (currentTab === 'reels' ? '#94A3B8' : colors.tabInactive),
                  }}
                />
                {currentTab === 'explore' && (
                  <div
                    className={`rounded-full absolute bottom-0.5 transition-all duration-300 ${
                      isCompactNav ? 'w-2 h-0.5' : 'w-3 h-0.5'
                    }`}
                    style={{ backgroundColor: colors.text }}
                  />
                )}
              </button>

              {/* Reels */}
              <button
                onClick={() => handleTabChange('reels')}
                className="flex flex-col items-center justify-center p-1.5 relative hover:opacity-80 transition-opacity"
              >
                <Play
                  size={isCompactNav ? 16 : 19}
                  className="transition-all duration-300"
                  style={{
                    color: currentTab === 'reels'
                      ? '#FFFFFF'
                      : colors.tabInactive,
                  }}
                />
                {currentTab === 'reels' && (
                  <div
                    className={`rounded-full absolute bottom-0.5 transition-all duration-300 ${
                      isCompactNav ? 'w-2 h-0.5' : 'w-3 h-0.5'
                    }`}
                    style={{ backgroundColor: '#FFFFFF' }}
                  />
                )}
              </button>



              {/* Create */}
              <button
                onClick={() => handleTabChange('create')}
                className="flex flex-col items-center justify-center p-1.5 relative hover:opacity-80 transition-opacity"
              >
                <Plus
                  size={isCompactNav ? 17 : 20}
                  className="transition-all duration-300"
                  style={{
                    color: currentTab === 'create'
                      ? colors.tabActive
                      : (currentTab === 'reels' ? '#94A3B8' : colors.tabInactive),
                  }}
                />
                {currentTab === 'create' && (
                  <div
                    className={`rounded-full absolute bottom-0.5 transition-all duration-300 ${
                      isCompactNav ? 'w-2 h-0.5' : 'w-3 h-0.5'
                    }`}
                    style={{ backgroundColor: colors.text }}
                  />
                )}
              </button>

              {/* Notifications / Activity */}
              <button
                onClick={() => handleTabChange('notifications')}
                className="flex flex-col items-center justify-center p-1.5 relative hover:opacity-80 transition-opacity"
                title="Notifications"
              >
                <Bell
                  size={isCompactNav ? 16 : 19}
                  className="transition-all duration-300"
                  style={{
                    color: currentTab === 'notifications'
                      ? colors.tabActive
                      : (currentTab === 'reels' ? '#94A3B8' : colors.tabInactive),
                  }}
                />
                {currentTab === 'notifications' && (
                  <div
                    className={`rounded-full absolute bottom-0.5 transition-all duration-300 ${
                      isCompactNav ? 'w-2 h-0.5' : 'w-3 h-0.5'
                    }`}
                    style={{ backgroundColor: colors.text }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reel Comments Drawer Integration */}
      <ReelCommentsDrawer
        isOpen={!!activeReelComments}
        onClose={() => setActiveReelComments(null)}
        reel={activeReelComments ? {
          id: activeReelComments.id,
          author: {
            name: activeReelComments.author,
            username: activeReelComments.username,
            location: activeReelComments.location,
            avatarGradient: activeReelComments.avatarGradient?.join(', ') || '#3A3B4D, #2B2C3B',
          },
          gradient: activeReelComments.gradient,
          likes: activeReelComments.likes,
          likesCount: activeReelComments.likesCount,
          comments: activeReelComments.comments,
          commentsCount: activeReelComments.commentsCount,
          isLiked: activeReelComments.isLiked,
          isSaved: activeReelComments.isSaved,
        } as any : null}
        isDark={isDark}
        onCommentAdded={(reelId, text) => {
          setReels((prev) =>
            prev.map((r) => (r.id === reelId ? { ...r, commentsCount: r.commentsCount + 1 } : r))
          );
        }}
      />
    </div>
  );
};
