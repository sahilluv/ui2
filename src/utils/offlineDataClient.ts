import { useState, useEffect, useCallback, useRef } from 'react';
import { PostItem, ReelItem, INITIAL_POSTS, INITIAL_REELS } from '../data/mockData';
import { generateMorePostItems, generateMoreReelItems } from './endlessScrollData';

// Cache keys for multi-tier persistence (Cache Storage API + LocalStorage)
const FEED_CACHE_KEY = 'shadow_offline_feed_v2';
const REELS_CACHE_KEY = 'shadow_offline_reels_v2';
const CACHE_NAME = 'shadow-data-v1';

// In-memory runtime cache for 0ms access
let inMemoryFeed: PostItem[] | null = null;
let inMemoryReels: ReelItem[] | null = null;

// Synchronous initial hydrator from local storage
function getInitialFeed(): PostItem[] {
  if (inMemoryFeed) return inMemoryFeed;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(FEED_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryFeed = parsed;
          return parsed;
        }
      }
    }
  } catch (_e) {
    // Ignore parse error
  }
  inMemoryFeed = INITIAL_POSTS;
  return INITIAL_POSTS;
}

function getInitialReels(): ReelItem[] {
  if (inMemoryReels) return inMemoryReels;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(REELS_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryReels = parsed;
          return parsed;
        }
      }
    }
  } catch (_e) {
    // Ignore parse error
  }
  inMemoryReels = INITIAL_REELS;
  return INITIAL_REELS;
}

// Persist data across both Cache Storage API and localStorage transparently
export async function persistFeedCache(posts: PostItem[]): Promise<void> {
  inMemoryFeed = posts;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(posts));
    }
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(CACHE_NAME);
      const res = new Response(JSON.stringify({ posts, timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put('/api/feed', res);
    }
  } catch (_err) {
    // Silent fallback
  }
}

export async function persistReelsCache(reels: ReelItem[]): Promise<void> {
  inMemoryReels = reels;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(REELS_CACHE_KEY, JSON.stringify(reels));
    }
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(CACHE_NAME);
      const res = new Response(JSON.stringify({ reels, timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json' },
      });
      await cache.put('/api/reels', res);
    }
  } catch (_err) {
    // Silent fallback
  }
}

/**
 * Transparent network request interceptor for Feed.
 * Tries network first; if disconnected or failed, immediately returns cached feed.
 */
export async function fetchFeedTransparent(): Promise<PostItem[]> {
  try {
    // If browser is explicitly offline, immediately return cached feed
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return getInitialFeed();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('/api/feed', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.posts) && data.posts.length > 0) {
        await persistFeedCache(data.posts);
        return data.posts;
      }
    }
  } catch (_err) {
    // Intercepted: Network request failed or aborted (offline/slow)
  }

  // Transparently fallback to cached data
  return getInitialFeed();
}

/**
 * Transparent network request interceptor for Reels.
 * Tries network first; if disconnected or failed, immediately returns cached reels.
 */
export async function fetchReelsTransparent(): Promise<ReelItem[]> {
  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return getInitialReels();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('/api/reels', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.reels) && data.reels.length > 0) {
        await persistReelsCache(data.reels);
        return data.reels;
      }
    }
  } catch (_err) {
    // Intercepted: Network request failed or aborted (offline/slow)
  }

  // Transparently fallback to cached data
  return getInitialReels();
}

/**
 * React Hook: useOfflineFeed
 * Seamlessly provides offline-first feed data, background revalidation,
 * and persistent optimistic updates for likes, saves, and comments.
 */
export function useOfflineFeed() {
  const [posts, setPosts] = useState<PostItem[]>(() => getInitialFeed());
  const isMountedRef = useRef(true);

  // Background revalidation
  const revalidate = useCallback(async () => {
    const freshPosts = await fetchFeedTransparent();
    if (isMountedRef.current && freshPosts && freshPosts.length > 0) {
      setPosts(freshPosts);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void revalidate();

    // Transparently revalidate when network connection is restored
    const handleOnline = () => {
      void revalidate();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('online', handleOnline);
    };
  }, [revalidate]);

  // Update posts in state & persistent cache
  const updatePosts = useCallback((updater: (prev: PostItem[]) => PostItem[]) => {
    setPosts((prev) => {
      const updated = updater(prev);
      void persistFeedCache(updated);
      return updated;
    });
  }, []);

  // Optimistic Like with transparent persistent cache sync
  const toggleLikePost = useCallback((postId: string) => {
    updatePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
            likedByText: isLiked
              ? `You and ${post.likesCount.toLocaleString()} others`
              : `${post.likesCount.toLocaleString()} likes`,
          };
        }
        return post;
      })
    );
  }, [updatePosts]);

  // Optimistic Save with transparent persistent cache sync
  const toggleSavePost = useCallback((postId: string) => {
    updatePosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: !post.isSaved,
          };
        }
        return post;
      })
    );
  }, [updatePosts]);

  // Endless feed pagination state & generator
  const feedPageRef = useRef(1);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMorePosts) return;
    setIsLoadingMorePosts(true);
    try {
      // Natural fluid delay for smooth UX transition
      await new Promise((resolve) => setTimeout(resolve, 380));
      feedPageRef.current += 1;
      const nextBatch = generateMorePostItems(feedPageRef.current, 3);
      updatePosts((prev) => [...prev, ...nextBatch]);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingMorePosts(false);
      }
    }
  }, [isLoadingMorePosts, updatePosts]);

  // Add new post directly to transparent cache
  const addNewPost = useCallback((newPost: PostItem) => {
    updatePosts((prev) => [newPost, ...prev]);
  }, [updatePosts]);

  return {
    posts,
    setPosts: updatePosts,
    refreshFeed: revalidate,
    toggleLikePost,
    toggleSavePost,
    addNewPost,
    loadMorePosts,
    isLoadingMorePosts,
  };
}

/**
 * React Hook: useOfflineReels
 * Seamlessly provides offline-first reels data, background revalidation,
 * and persistent optimistic updates for likes, saves, comments, and endless scrolling.
 */
export function useOfflineReels() {
  const [reels, setReels] = useState<ReelItem[]>(() => getInitialReels());
  const isMountedRef = useRef(true);
  const reelsPageRef = useRef(1);
  const [isLoadingMoreReels, setIsLoadingMoreReels] = useState(false);

  // Background revalidation
  const revalidate = useCallback(async () => {
    const freshReels = await fetchReelsTransparent();
    if (isMountedRef.current && freshReels && freshReels.length > 0) {
      setReels(freshReels);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void revalidate();

    // Transparently revalidate when network connection is restored
    const handleOnline = () => {
      void revalidate();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('online', handleOnline);
    };
  }, [revalidate]);

  // Update reels in state & persistent cache
  const updateReels = useCallback((updater: (prev: ReelItem[]) => ReelItem[]) => {
    setReels((prev) => {
      const updated = updater(prev);
      void persistReelsCache(updated);
      return updated;
    });
  }, []);

  // Endless reels loader
  const loadMoreReels = useCallback(async () => {
    if (isLoadingMoreReels) return;
    setIsLoadingMoreReels(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 320));
      reelsPageRef.current += 1;
      const nextBatch = generateMoreReelItems(reelsPageRef.current, 3);
      updateReels((prev) => [...prev, ...nextBatch]);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingMoreReels(false);
      }
    }
  }, [isLoadingMoreReels, updateReels]);

  // Optimistic Like on Reel
  const toggleLikeReel = useCallback((reelId: string) => {
    updateReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const nextLiked = !reel.isLiked;
          const nextCount = nextLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1);
          return {
            ...reel,
            isLiked: nextLiked,
            likesCount: nextCount,
            likes: nextCount >= 1000 ? `${(nextCount / 1000).toFixed(1)}k` : `${nextCount}`,
          };
        }
        return reel;
      })
    );
  }, [updateReels]);

  // Optimistic Save on Reel
  const toggleSaveReel = useCallback((reelId: string) => {
    updateReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          return {
            ...reel,
            isSaved: !reel.isSaved,
          };
        }
        return reel;
      })
    );
  }, [updateReels]);

  // Optimistic Comment Added on Reel
  const incrementReelComments = useCallback((reelId: string) => {
    updateReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const nextCount = reel.commentsCount + 1;
          return {
            ...reel,
            commentsCount: nextCount,
            comments: `${nextCount}`,
          };
        }
        return reel;
      })
    );
  }, [updateReels]);

  return {
    reels,
    setReels: updateReels,
    refreshReels: revalidate,
    toggleLikeReel,
    toggleSaveReel,
    incrementReelComments,
    loadMoreReels,
    isLoadingMoreReels,
  };
}
