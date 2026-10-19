export interface StoryItem {
  id: string;
  username: string;
  gradient: string;
  avatarGradient: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  hasUnseen?: boolean;
  imageUrl?: string;
  storyImageUrl?: string;
  storyCaption?: string;
  storySticker?: string;
  storyTimestamp?: string;
}

export interface ReelItem {
  id: string;
  author: {
    name: string;
    username: string;
    location: string;
    avatarGradient: string;
    avatarUrl?: string;
  };
  gradient: string;
  videoUrl?: string;
  posterUrl?: string;
  audioTrack?: string;
  caption?: string;
  tags?: string[];
  likes: string;
  likesCount: number;
  comments: string;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

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
  /** ISO-8601 timestamp when the physical encounter was captured */
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

export interface PostItem {
  id: string;
  author: {
    name: string;
    username: string;
    avatarGradient: string;
    avatarUrl?: string;
    location?: string;
  };
  timeAgo: string;
  gradient: string;
  imageUrl?: string;
  imageStyle?: string;
  likesCount: number;
  commentsCount: number;
  likedByText: string;
  captionTitle: string;
  captionBody: string;
  totalPages?: number;
  currentPage?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  /** Distinguishes standard social posts from real-world Shadow Encounters */
  postType?: 'standard' | 'shadow_encounter';
  /** Present when the post represents a captured real-world Shadow Encounter */
  shadowEncounter?: ShadowEncounter;
}

export interface CategoryItem {
  id: string;
  title: string;
  iconName: string;
  gradient: string;
}

export interface ExploreCard {
  id: string;
  heightClass: string;
  gradient: string;
  title: string;
  category: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  gradient: string;
  isAdd?: boolean;
}

export interface NotificationItem {
  id: string;
  user: {
    name: string;
    username: string;
    avatarGradient: string;
    avatarUrl?: string;
  };
  actionType: 'like' | 'comment' | 'follow' | 'mention';
  content: string;
  timeAgo: string;
  postThumbnailGradient?: string;
  isRead: boolean;
}

export const INITIAL_STORIES: StoryItem[] = [
  {
    id: 'user_story',
    username: 'Your story',
    gradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 35%, #8A2BE2 70%, #4F46E5 100%)',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 50%, #0E0E0E 100%)',
    avatarUrl: '/src/assets/images/avatar_mauricio_designer_1792313922880.jpg',
    isCurrentUser: true,
  },
  {
    id: 'story_elena',
    username: 'Elena.art',
    gradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 35%, #8A2BE2 70%, #4F46E5 100%)',
    avatarGradient: 'linear-gradient(135deg, #242424 0%, #121212 100%)',
    avatarUrl: '/src/assets/images/avatar_elena_artist_1792313923579.jpg',
    storyImageUrl: '/src/assets/images/shadow_artwork_one_1790311065756.jpg',
    storyCaption: 'Noir light test in the Berlin darkroom 🖤',
    storySticker: '📍 Shadow Lab • Berlin',
    storyTimestamp: '45m ago',
    hasUnseen: true,
  },
  {
    id: 'story_christian',
    username: 'Christian.l',
    gradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 35%, #8A2BE2 70%, #4F46E5 100%)',
    avatarGradient: 'linear-gradient(135deg, #262626 0%, #141414 100%)',
    avatarUrl: '/src/assets/images/avatar_christian_creator_1792313923903.jpg',
    storyImageUrl: '/src/assets/images/feed_art_brutalist_1792313925585.jpg',
    storyCaption: 'Brutalist concrete pavilion at blue hour ✨',
    storySticker: '#SHADOW · 24h',
    storyTimestamp: '2h ago',
    hasUnseen: true,
  },
  {
    id: 'story_claire',
    username: 'Claire_d',
    gradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 35%, #8A2BE2 70%, #4F46E5 100%)',
    avatarGradient: 'linear-gradient(135deg, #202020 0%, #101010 100%)',
    avatarUrl: '/src/assets/images/claire_green_profile_1790960159362.jpg',
    storyImageUrl: '/src/assets/images/shadow_artwork_two_1790311076323.jpg',
    storyCaption: 'New procedural iridescent shaders compiling...',
    storySticker: '♫ Mauricio • Harmonic Void',
    storyTimestamp: '4h ago',
    hasUnseen: true,
  },
  {
    id: 'story_carlos',
    username: 'Carlos_v',
    gradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 35%, #8A2BE2 70%, #4F46E5 100%)',
    avatarGradient: 'linear-gradient(135deg, #282828 0%, #0E0E0E 100%)',
    avatarUrl: '/src/assets/images/girl_glasses_bun_1791874584066.jpg',
    storyImageUrl: '/src/assets/images/feed_art_biomorphic_1792313924712.jpg',
    storyCaption: 'Bioluminescent tendrils exhibition node',
    storySticker: '📍 Shibuya Node • Tokyo',
    storyTimestamp: '6h ago',
    hasUnseen: true,
  },
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post_maoo',
    author: {
      name: 'Mauricio Lopez',
      username: 'Maoo.lopez',
      avatarGradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 50%, #8A2BE2 100%)',
      avatarUrl: '/src/assets/images/avatar_mauricio_designer_1792313922880.jpg',
      location: 'Shadow Lab • Berlin',
    },
    timeAgo: '20m ago',
    gradient: 'linear-gradient(180deg, #262626 0%, #1A1A1A 35%, #121212 65%, #0A0A0A 100%)',
    imageUrl: '/src/assets/images/feed_art_biomorphic_1792313924712.jpg',
    likesCount: 4558,
    commentsCount: 500,
    likedByText: 'danieldelax and 4,558 others',
    captionTitle: 'SACRIFICE | VIRUS',
    captionBody: 'Bio-digital sculpture study examining crystalline node formation and bioluminescent tendrils.',
    totalPages: 3,
    currentPage: 1,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_elena',
    author: {
      name: 'Elena Rostova',
      username: 'Elena.art',
      avatarGradient: 'linear-gradient(135deg, #FF0A78 0%, #8A2BE2 100%)',
      avatarUrl: '/src/assets/images/avatar_elena_artist_1792313923579.jpg',
      location: 'Kunsthal • Rotterdam',
    },
    timeAgo: '1h ago',
    gradient: 'linear-gradient(135deg, #2E2E2E 0%, #1F1F1F 35%, #141414 70%, #0A0A0A 100%)',
    imageUrl: '/src/assets/images/shadow_artwork_one_1790311065756.jpg',
    likesCount: 3840,
    commentsCount: 245,
    likedByText: 'maoo.lopez and 3,839 others',
    captionTitle: 'NOIR REFRACTION',
    captionBody: 'Interplay between deep obsidian volumes and subtle chromatic aberrations in darkroom lighting.',
    totalPages: 1,
    currentPage: 1,
    isLiked: true,
    isSaved: true,
  },
  {
    id: 'post_christian',
    author: {
      name: 'Christian Lue',
      username: 'Christian Lue',
      avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #151515 100%)',
      avatarUrl: '/src/assets/images/avatar_christian_creator_1792313923903.jpg',
      location: 'Ghent, Belgium',
    },
    timeAgo: '3h ago',
    gradient: 'linear-gradient(135deg, #262626 0%, #1B1B1B 40%, #141414 75%, #0B0B0B 100%)',
    imageUrl: '/src/assets/images/feed_art_brutalist_1792313925585.jpg',
    likesCount: 2910,
    commentsCount: 132,
    likedByText: 'elena.art and 2,909 others',
    captionTitle: 'BRUTALIST FORMS',
    captionBody: 'Coastal concrete pavilion at blue hour. Geometry carved through heavy shadows and amber glow.',
    totalPages: 1,
    currentPage: 1,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'post_claire',
    author: {
      name: 'Claire Dubois',
      username: 'Claire_d',
      avatarGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      avatarUrl: '/src/assets/images/claire_green_profile_1790960159362.jpg',
      location: 'Studio 9 • Paris',
    },
    timeAgo: '5h ago',
    gradient: 'linear-gradient(135deg, #1F1F24 0%, #16161B 50%, #0D0D10 100%)',
    imageUrl: '/src/assets/images/shadow_artwork_two_1790311076323.jpg',
    likesCount: 1980,
    commentsCount: 88,
    likedByText: 'marco.visuals and 1,979 others',
    captionTitle: 'CHROMA RESONANCE',
    captionBody: 'Dual-frequency spectrum renders testing our new Shadow UI glass shader pipeline.',
    totalPages: 2,
    currentPage: 1,
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'post_encounter_1',
    author: {
      name: 'Kenji Sato',
      username: 'kenji.tokyo',
      avatarGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      avatarUrl: '/src/assets/images/character_pointing_jacket_1791874566016.jpg',
      location: 'Shibuya Crossing • Tokyo',
    },
    timeAgo: '7h ago',
    gradient: 'linear-gradient(135deg, #1C1C22 0%, #121217 60%, #08080C 100%)',
    imageUrl: '/src/assets/images/shadow_artwork_three_1790311086351.jpg',
    likesCount: 5120,
    commentsCount: 388,
    likedByText: 'maoo.lopez and 5,119 others',
    captionTitle: 'SHADOW ENCOUNTER #882',
    captionBody: 'Captured physical beacon encounter at Shibuya Crossing. Chain verified +450 REP with Knight rank peers.',
    totalPages: 1,
    currentPage: 1,
    isLiked: true,
    isSaved: false,
    postType: 'shadow_encounter',
    shadowEncounter: {
      encounterId: 'enc_shibuya_9921',
      shadowId: 'shdw_kenji04',
      emitterUserId: 'usr_tokyo_node_01',
      timestamp: '2026-10-18T05:30:00Z',
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

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'igtv',
    title: 'IGTV',
    iconName: 'Tv',
    gradient: 'linear-gradient(180deg, #FF0A78 0%, #FF8A00 100%)',
  },
  {
    id: 'tienda',
    title: 'SHOP',
    iconName: 'ShoppingBag',
    gradient: 'linear-gradient(180deg, #4F46E5 0%, #3B82F6 100%)',
  },
  {
    id: 'viajes',
    title: 'TRAVEL',
    iconName: 'Plane',
    gradient: 'linear-gradient(180deg, #8A2BE2 0%, #7B2CBF 100%)',
  },
  {
    id: 'fitness',
    title: 'FITNESS',
    iconName: 'Dumbbell',
    gradient: 'linear-gradient(180deg, #FF0A78 0%, #E1306C 100%)',
  },
];

export const EXPLORE_CARDS: ExploreCard[] = [
  {
    id: 'exp_1',
    heightClass: 'h-44',
    gradient: 'linear-gradient(145deg, #262626 0%, #1A1A1A 50%, #101010 100%)',
    title: 'Slate Architecture',
    category: 'Architecture',
  },
  {
    id: 'exp_2',
    heightClass: 'h-38',
    gradient: 'linear-gradient(145deg, #222222 0%, #161616 50%, #0E0E0E 100%)',
    title: 'Deep Obsidian',
    category: 'Abstract',
  },
  {
    id: 'exp_3',
    heightClass: 'h-40',
    gradient: 'linear-gradient(145deg, #202020 0%, #141414 50%, #0C0C0C 100%)',
    title: 'Dark Charcoal Depth',
    category: 'Cyber',
  },
  {
    id: 'exp_4',
    heightClass: 'h-36',
    gradient: 'linear-gradient(145deg, #282828 0%, #181818 50%, #121212 100%)',
    title: 'Stealth Noir',
    category: 'Design',
  },
  {
    id: 'exp_5',
    heightClass: 'h-50',
    gradient: 'linear-gradient(145deg, #2D2D2D 0%, #1E1E1E 35%, #151515 70%, #0A0A0A 100%)',
    title: 'Monochrome Wave',
    category: 'Nature',
  },
  {
    id: 'exp_6',
    heightClass: 'h-32',
    gradient: 'linear-gradient(145deg, #1F1F1F 0%, #151515 50%, #0A0A0A 100%)',
    title: 'Shadow Aurora',
    category: 'Editorial',
  },
  {
    id: 'exp_7',
    heightClass: 'h-36',
    gradient: 'linear-gradient(145deg, #242424 0%, #161616 50%, #0D0D0D 100%)',
    title: 'Matte Onyx',
    category: 'Art',
  },
];

export const HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'hl_1',
    title: 'Best shots',
    gradient: 'linear-gradient(145deg, #FF0A78 0%, #E1306C 40%, #8A2BE2 100%)',
    isAdd: true,
  },
  {
    id: 'hl_2',
    title: 'My vibe',
    gradient: 'linear-gradient(145deg, #4F46E5 0%, #8A2BE2 50%, #FF0A78 100%)',
  },
  {
    id: 'hl_3',
    title: 'Favorites',
    gradient: 'linear-gradient(145deg, #FF8A00 0%, #FF0A78 50%, #8A2BE2 100%)',
  },
  {
    id: 'hl_4',
    title: 'Food',
    gradient: 'linear-gradient(145deg, #8A2BE2 0%, #E1306C 50%, #FFB347 100%)',
  },
];

export const NOTIFICATIONS_DATA: NotificationItem[] = [
  {
    id: 'notif_1',
    user: {
      name: 'Elena Rostova',
      username: 'Elena.art',
      avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 50%, #0E0E0E 100%)',
      avatarUrl: '/src/assets/images/avatar_elena_artist_1792313923579.jpg',
    },
    actionType: 'like',
    content: 'liked your post "SACRIFICE | VIRUS"',
    timeAgo: '5m ago',
    postThumbnailGradient: 'linear-gradient(135deg, #222222 0%, #161616 50%, #0E0E0E 100%)',
    isRead: false,
  },
  {
    id: 'notif_2',
    user: {
      name: 'Carlos Valenzuela',
      username: 'Carlos_v',
      avatarGradient: 'linear-gradient(135deg, #282828 0%, #181818 50%, #0C0C0C 100%)',
      avatarUrl: '/src/assets/images/girl_glasses_bun_1791874584066.jpg',
    },
    actionType: 'comment',
    content: 'commented: "The monochrome composition and contrast are incredible 🔥"',
    timeAgo: '23m ago',
    postThumbnailGradient: 'linear-gradient(135deg, #222222 0%, #161616 50%, #0E0E0E 100%)',
    isRead: false,
  },
  {
    id: 'notif_3',
    user: {
      name: 'Claire Dubois',
      username: 'claire_d',
      avatarGradient: 'linear-gradient(135deg, #262626 0%, #191919 50%, #0D0D0D 100%)',
      avatarUrl: '/src/assets/images/claire_green_profile_1790960159362.jpg',
    },
    actionType: 'follow',
    content: 'started following you.',
    timeAgo: '2h ago',
    isRead: true,
  },
  {
    id: 'notif_4',
    user: {
      name: 'Christian Lue',
      username: 'christian.lue',
      avatarGradient: 'linear-gradient(135deg, #242424 0%, #171717 50%, #0E0E0E 100%)',
      avatarUrl: '/src/assets/images/avatar_christian_creator_1792313923903.jpg',
    },
    actionType: 'like',
    content: 'and 45 others liked your story.',
    timeAgo: '4h ago',
    postThumbnailGradient: 'linear-gradient(135deg, #252525 0%, #181818 50%, #0A0A0A 100%)',
    isRead: true,
  },
  {
    id: 'notif_5',
    user: {
      name: 'Alice Cooper',
      username: 'Alice_002',
      avatarGradient: 'linear-gradient(135deg, #2C2C2C 0%, #1C1C1C 50%, #121212 100%)',
      avatarUrl: '/src/assets/images/girl_reading_armchair_1791874547627.jpg',
    },
    actionType: 'mention',
    content: 'mentioned you in a comment: "@maoo.lopez check this out"',
    timeAgo: 'Yesterday',
    isRead: true,
  },
];

export const INITIAL_REELS: ReelItem[] = [
  {
    id: 'reel_eliott',
    author: {
      name: 'Mauricio Lopez',
      username: 'maoo.lopez',
      location: 'Berlin, Germany',
      avatarGradient: 'linear-gradient(135deg, #242424 0%, #141414 100%)',
      avatarUrl: '/src/assets/images/avatar_mauricio_designer_1792313922880.jpg',
    },
    gradient: 'linear-gradient(180deg, #262626 0%, #1C1C1C 30%, #141414 65%, #0A0A0A 100%)',
    posterUrl: '/src/assets/images/feed_art_biomorphic_1792313924712.jpg',
    audioTrack: 'Mauricio Lopez • Harmonic Void (432Hz Original)',
    caption: 'Sculpting fluid light and shadow in 3D canvas space ♟️',
    tags: ['#ShadowConcept', '#FluidArt', '#Generative'],
    likes: '2,4k',
    likesCount: 2400,
    comments: '175',
    commentsCount: 175,
    isLiked: true,
    isSaved: false,
  },
  {
    id: 'reel_christian',
    author: {
      name: 'Christian Lue',
      username: 'christian.lue',
      location: 'Ghent, Belgium',
      avatarGradient: 'linear-gradient(135deg, #282828 0%, #161616 100%)',
      avatarUrl: '/src/assets/images/avatar_christian_creator_1792313923903.jpg',
    },
    gradient: 'linear-gradient(180deg, #2A2A2A 0%, #1E1E1E 35%, #151515 70%, #0C0C0C 100%)',
    posterUrl: '/src/assets/images/feed_art_brutalist_1792313925585.jpg',
    audioTrack: 'Christian Lue • Brutalist Echoes ft. Synthwave',
    caption: 'Brutalist typography meets dynamic glass refractions.',
    tags: ['#Brutalism', '#Typography', '#Visuals'],
    likes: '1,8k',
    likesCount: 1800,
    comments: '92',
    commentsCount: 92,
    isLiked: false,
    isSaved: true,
  },
  {
    id: 'reel_sofia',
    author: {
      name: 'Elena Rostova',
      username: 'elena.art',
      location: 'Tokyo, Japan',
      avatarGradient: 'linear-gradient(135deg, #222222 0%, #121212 100%)',
      avatarUrl: '/src/assets/images/avatar_elena_artist_1792313923579.jpg',
    },
    gradient: 'linear-gradient(180deg, #262626 0%, #1B1B1B 40%, #131313 70%, #0A0A0A 100%)',
    posterUrl: '/src/assets/images/shadow_artwork_one_1790311065756.jpg',
    audioTrack: 'Elena Rostova • Cyber Neon Resonance (Tokyo Drift)',
    caption: 'Night atmospheric shader test. Liquid physics at 60fps.',
    tags: ['#TokyoVibes', '#Cyberpunk', '#WebGL'],
    likes: '3,9k',
    likesCount: 3900,
    comments: '340',
    commentsCount: 340,
    isLiked: false,
    isSaved: false,
  },
];

