import { PostItem, ReelItem } from '../data/mockData';
import { FeedPost, ReelData } from '../components/UnifiedShadowApp';

/**
 * Curated pool of high-aesthetic Shadow creator personas
 */
const CREATORS_POOL = [
  {
    name: 'Elena Rostova',
    username: 'elena.art',
    location: 'Madrid, Spain',
    avatarGradient: 'linear-gradient(135deg, #7B52B9 0%, #8456C5 50%, #5E3A89 100%)',
    avatarColors: ['#7B52B9', '#8456C5', '#5E3A89'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #4E137D 0%, #8456C5 50%, #7B52B9 100%)',
    postColors: ['#4E137D', '#8456C5', '#7B52B9'] as [string, string, ...string[]],
    captionTitle: 'CHROMATIC NEBULA',
    captionBody: 'Exploring refractive glass prisms under low-frequency ultraviolet lighting.',
    reelGradient: 'linear-gradient(180deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)',
    reelColors: ['#3A1C71', '#D76D77', '#FFAF7B'],
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Elena Rostova • Ultraviolet Frequencies (Deep Mix)',
    reelCaption: 'Visualizing fluid dynamics inside an iridescent nano-cube 🔮✨',
    tags: ['#DigitalArt', '#Fluid3D', '#MotionDesign'],
  },
  {
    name: 'Marco Rossi',
    username: 'marco.visuals',
    location: 'Milan, Italy',
    avatarGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)',
    avatarColors: ['#8B5CF6', '#6366F1', '#3B82F6'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #101B2B 0%, #1A2E44 50%, #203A56 100%)',
    postColors: ['#101B2B', '#1A2E44', '#203A56'] as [string, string, ...string[]],
    captionTitle: 'MONOLITH & SHADOW',
    captionBody: 'Spatial audio visualizer experimenting with Sem UI dark depth layers.',
    reelGradient: 'linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    reelColors: ['#0F2027', '#203A43', '#2C5364'],
    posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Marco Rossi • Cybernetic Pulse & Bass',
    reelCaption: 'Modular synth jam running through hardware oscilloscope screen 🔥',
    tags: ['#ModularSynth', '#Cyberpunk', '#LiveAudio'],
  },
  {
    name: 'Aria Chen',
    username: 'aria.design',
    location: 'Singapore',
    avatarGradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #6366F1 100%)',
    avatarColors: ['#06B6D4', '#3B82F6', '#6366F1'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #0D4E5B 0%, #147D8E 50%, #22A6B3 100%)',
    postColors: ['#0D4E5B', '#147D8E', '#22A6B3'] as [string, string, ...string[]],
    captionTitle: 'HOLOGRAPHIC TILES',
    captionBody: 'Micro-interactions on glass surfaces. Zero lag, 120fps fluid transitions.',
    reelGradient: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    reelColors: ['#1A1A2E', '#16213E', '#0F3460'],
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Aria Chen • Holographic Dreams ft. Chillhop',
    reelCaption: 'Speedrun redesigning the Sem UI Shadow card stack with zero pills and pure typography!',
    tags: ['#UIUX', '#DesignTok', '#ShadowApp'],
  },
  {
    name: 'Lucas Vance',
    username: 'lucas.cyber',
    location: 'Berlin, Germany',
    avatarGradient: 'linear-gradient(135deg, #FF5E62 0%, #FF7F50 50%, #FFA07A 100%)',
    avatarColors: ['#FF5E62', '#FF7F50', '#FFA07A'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #2D112C 0%, #53005A 50%, #861657 100%)',
    postColors: ['#2D112C', '#53005A', '#861657'] as [string, string, ...string[]],
    captionTitle: 'SYNTHESIS & PULSE',
    captionBody: 'Live modular set captured with anamorphic cinema lenses during Berlin Tech Week.',
    reelGradient: 'linear-gradient(180deg, #4A00E0 0%, #8E2DE2 50%, #F000FF 100%)',
    reelColors: ['#4A00E0', '#8E2DE2', '#F000FF'],
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Berlin Underground • 138BPM Warehouse Echoes',
    reelCaption: 'Laser mapping through heavy fog at Kraftwerk Berlin 🌫️⚡️',
    tags: ['#BerlinTechno', '#LaserArt', '#Visuals'],
  },
  {
    name: 'Kenji Takahashi',
    username: 'kenji_tokyo',
    location: 'Tokyo, Japan',
    avatarGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #78350F 100%)',
    avatarColors: ['#F59E0B', '#D97706', '#78350F'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #1A365D 0%, #2B6CB0 40%, #4299E1 70%, #90CDF4 100%)',
    postColors: ['#1A365D', '#2B6CB0', '#4299E1', '#90CDF4'] as [string, string, ...string[]],
    captionTitle: 'NEO-SHINJUKU SHADOWS',
    captionBody: 'Rain reflections on wet asphalt at 3AM. The night reveals hidden city architecture.',
    reelGradient: 'linear-gradient(180deg, #000428 0%, #004e92 100%)',
    reelColors: ['#000428', '#004e92'],
    posterUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Tokyo Night Ride • Lo-Fi Cityscape',
    reelCaption: 'Midnight motorcycle hyperlapse across the Rainbow Bridge in Shinjuku 🏍️💨',
    tags: ['#TokyoNights', '#Hyperlapse', '#Cinematic'],
  },
  {
    name: 'Zoe Kravitz',
    username: 'zoe.lens',
    location: 'London, UK',
    avatarGradient: 'linear-gradient(135deg, #C026D3 0%, #7928CA 50%, #3B82F6 100%)',
    avatarColors: ['#C026D3', '#7928CA', '#3B82F6'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #2A0845 0%, #6441A5 50%, #FE8C00 100%)',
    postColors: ['#2A0845', '#6441A5', '#FE8C00'] as [string, string, ...string[]],
    captionTitle: 'ANALOG HORIZON',
    captionBody: '35mm tungsten film pushed 2 stops. Moody tones and grain for the night feed.',
    reelGradient: 'linear-gradient(180deg, #200122 0%, #6f0000 100%)',
    reelColors: ['#200122', '#6f0000'],
    posterUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'London Dusk • Rainy Mood 35mm Tape',
    reelCaption: 'Subway reflections and motion blur on Kodak 500T 🎥',
    tags: ['#AnalogFilm', '#35mm', '#LondonLife'],
  },
  {
    name: 'Nova Collective',
    username: 'nova.studio',
    location: 'Seoul, South Korea',
    avatarGradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
    avatarColors: ['#10B981', '#059669', '#047857'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    postColors: ['#134E5E', '#71B280'] as [string, string, ...string[]],
    captionTitle: 'FLUID CHROME',
    captionBody: 'Realtime ray-marched physics simulating molten silver in zero gravity.',
    reelGradient: 'linear-gradient(180deg, #0B486B 0%, #F56217 100%)',
    reelColors: ['#0B486B', '#F56217'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Nova Collective • Liquid Silver Resonance',
    reelCaption: '3D particle simulation: 1,000,000 glowing embers reacting to beat drops 🎆',
    tags: ['#Particles', '#Blender3D', '#CreativeCode'],
  },
  {
    name: 'Kai Sterling',
    username: 'kai.shadow',
    location: 'San Francisco, USA',
    avatarGradient: 'linear-gradient(135deg, #6366F1 0%, #7B52B9 50%, #5E3A89 100%)',
    avatarColors: ['#6366F1', '#7B52B9', '#5E3A89'] as [string, string, ...string[]],
    postGradient: 'linear-gradient(135deg, #1F1C2C 0%, #928DAB 100%)',
    postColors: ['#1F1C2C', '#928DAB'] as [string, string, ...string[]],
    captionTitle: 'GEOMETRIC ENCOUNTER',
    captionBody: 'Pawn Rank vanguard deployment beacon detected at Silicon Valley hub.',
    reelGradient: 'linear-gradient(180deg, #240b36 0%, #c31432 100%)',
    reelColors: ['#240b36', '#c31432'],
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    audioTrack: 'Kai Sterling • Tactical Elevation Bass',
    reelCaption: 'Unboxing the new Shadow tactile hardware interface prototype ♟️⚡️',
    tags: ['#ShadowHardware', '#CyberWearable', '#PawnRank'],
  },
];

/**
 * Generates an endless batch of PostItem objects for PhoneSimulator
 */
export function generateMorePostItems(page: number, count: number = 3): PostItem[] {
  const result: PostItem[] = [];
  const baseLikes = [2840, 4120, 1950, 6380, 3210, 5490, 8920];
  const baseComments = [142, 298, 88, 410, 215, 360, 642];

  for (let i = 0; i < count; i++) {
    const poolIndex = ((page - 1) * count + i) % CREATORS_POOL.length;
    const creator = CREATORS_POOL[poolIndex];
    const uniqueId = `post_endless_${page}_${i}_${Math.floor(Math.random() * 8999 + 1000)}`;
    const likes = baseLikes[(page + i) % baseLikes.length] + (page * 137);
    const comments = baseComments[(page + i) % baseComments.length] + (page * 19);

    // Occasional verified shadow encounter
    const isEncounter = (page + i) % 3 === 0;

    result.push({
      id: uniqueId,
      author: {
        name: creator.name,
        username: creator.username,
        avatarGradient: creator.avatarGradient,
        location: creator.location,
      },
      timeAgo: `${page * 2 + i + 1}h ago`,
      gradient: creator.postGradient,
      likesCount: likes,
      commentsCount: comments,
      likedByText: `danieldelax and ${likes.toLocaleString()} others`,
      captionTitle: creator.captionTitle,
      captionBody: creator.captionBody,
      totalPages: (page + i) % 2 === 0 ? 2 : 1,
      currentPage: 1,
      isLiked: false,
      isSaved: false,
      postType: isEncounter ? 'shadow_encounter' : 'standard',
      shadowEncounter: isEncounter
        ? {
            encounterId: `enc_${page}_${i}`,
            shadowId: `SHADOW-${1000 + page * 10 + i}`,
            timestamp: new Date(Date.now() - (page * 3600000)).toISOString(),
            location: {
              latitude: 40.4168 + (i * 0.05),
              longitude: -3.7038 + (i * 0.05),
              placeName: `${creator.location} • Sector ${page}`,
              isMocked: true,
            },
            validationStatus: 'verified',
          }
        : undefined,
    });
  }

  return result;
}

/**
 * Generates an endless batch of ReelItem objects for PhoneSimulator
 */
export function generateMoreReelItems(page: number, count: number = 3): ReelItem[] {
  const result: ReelItem[] = [];
  const baseLikes = [3200, 4800, 2600, 6100, 7800, 3900];
  const baseComments = [210, 340, 160, 480, 520, 290];

  for (let i = 0; i < count; i++) {
    const poolIndex = ((page - 1) * count + i) % CREATORS_POOL.length;
    const creator = CREATORS_POOL[poolIndex];
    const uniqueId = `reel_endless_${page}_${i}_${Math.floor(Math.random() * 8999 + 1000)}`;
    const likes = baseLikes[(page + i) % baseLikes.length] + (page * 240);
    const comments = baseComments[(page + i) % baseComments.length] + (page * 25);

    result.push({
      id: uniqueId,
      author: {
        name: creator.name,
        username: creator.username,
        location: creator.location,
        avatarGradient: creator.avatarGradient,
      },
      gradient: creator.reelGradient,
      posterUrl: creator.posterUrl,
      audioTrack: creator.audioTrack,
      caption: creator.reelCaption,
      tags: creator.tags,
      likes: likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : `${likes}`,
      likesCount: likes,
      comments: `${comments}`,
      commentsCount: comments,
      isLiked: false,
      isSaved: false,
    });
  }

  return result;
}

/**
 * Generates an endless batch of FeedPost objects for UnifiedShadowApp
 */
export function generateMoreFeedPosts(page: number, count: number = 3): FeedPost[] {
  const result: FeedPost[] = [];
  const baseLikes = [3120, 4820, 1980, 5740, 3490];
  const baseComments = [180, 310, 94, 420, 230];

  for (let i = 0; i < count; i++) {
    const poolIndex = ((page - 1) * count + i) % CREATORS_POOL.length;
    const creator = CREATORS_POOL[poolIndex];
    const uniqueId = `post_unified_endless_${page}_${i}_${Math.floor(Math.random() * 8999 + 1000)}`;
    const likes = baseLikes[(page + i) % baseLikes.length] + (page * 150);
    const comments = baseComments[(page + i) % baseComments.length] + (page * 22);
    const isEncounter = (page + i) % 2 === 0;

    result.push({
      id: uniqueId,
      authorName: creator.name,
      username: creator.username,
      avatarGradient: creator.avatarColors,
      timeAgo: `${page * 2 + i + 1}h ago`,
      imageGradient: creator.postColors,
      content: `${creator.captionBody} Shared via Sem UI Shadow endless feed.`,
      captionTitle: creator.captionTitle,
      likesCount: likes,
      commentsCount: comments,
      isLiked: false,
      isSaved: false,
      postType: isEncounter ? 'shadow_encounter' : 'standard',
      shadowEncounter: isEncounter
        ? {
            encounterId: `enc_uni_${page}_${i}`,
            shadowId: `SHADOW-PULSE-${2000 + page * 10 + i}`,
            timestamp: new Date(Date.now() - (page * 3600000)).toISOString(),
            location: {
              latitude: 40.4168 + (i * 0.03),
              longitude: -3.7038 + (i * 0.03),
              placeName: `${creator.location} (Zone ${page})`,
              isMocked: true,
            },
            validationStatus: 'verified',
          }
        : undefined,
    });
  }

  return result;
}

/**
 * Generates an endless batch of ReelData objects for UnifiedShadowApp
 */
export function generateMoreReelData(page: number, count: number = 3): ReelData[] {
  const result: ReelData[] = [];
  const baseLikes = [2900, 4200, 3100, 5900, 6800];
  const baseComments = [190, 280, 140, 390, 440];

  for (let i = 0; i < count; i++) {
    const poolIndex = ((page - 1) * count + i) % CREATORS_POOL.length;
    const creator = CREATORS_POOL[poolIndex];
    const uniqueId = `reel_unified_endless_${page}_${i}_${Math.floor(Math.random() * 8999 + 1000)}`;
    const likes = baseLikes[(page + i) % baseLikes.length] + (page * 210);
    const comments = baseComments[(page + i) % baseComments.length] + (page * 30);

    result.push({
      id: uniqueId,
      author: creator.name,
      username: creator.username,
      location: creator.location,
      gradient: creator.reelColors,
      likes: likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : `${likes}`,
      likesCount: likes,
      comments: `${comments}`,
      commentsCount: comments,
      bookmarksCount: Math.floor(comments * 0.65),
      isLiked: false,
      isSaved: false,
      isFollowing: false,
      caption: creator.reelCaption,
      tags: creator.tags,
      audioTrack: creator.audioTrack,
      avatarGradient: creator.reelColors,
    });
  }

  return result;
}
