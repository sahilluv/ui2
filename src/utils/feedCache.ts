import { PostItem, StoryItem } from '../data/mockData';

const FEED_CACHE_KEY = 'shadow_feed_cache_v1';
const FOLLOWED_AUTHORS_KEY = 'shadow_followed_authors_v1';
const CACHE_VERSION = 1;

export interface CachedFeedPayload {
  version: number;
  posts: PostItem[];
  stories?: StoryItem[];
  savedAt: number;
}

/**
 * Loads cached feed posts and stories from localStorage.
 * Returns null if cache is empty, corrupted, or unavailable.
 */
export function loadCachedFeed(): CachedFeedPayload | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const raw = window.localStorage.getItem(FEED_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedFeedPayload;
    if (!parsed || !Array.isArray(parsed.posts) || parsed.posts.length === 0) {
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn('[FeedCache] Failed to read from localStorage:', err);
    return null;
  }
}

/**
 * Persists current feed posts and stories to localStorage.
 */
export function saveFeedToCache(posts: PostItem[], stories?: StoryItem[]): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    const payload: CachedFeedPayload = {
      version: CACHE_VERSION,
      posts,
      stories,
      savedAt: Date.now(),
    };

    window.localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('[FeedCache] Failed to write to localStorage:', err);
    return false;
  }
}

/**
 * Loads cached followed authors state.
 */
export function loadCachedFollowedAuthors(): Record<string, boolean> | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const raw = window.localStorage.getItem(FOLLOWED_AUTHORS_KEY);
    if (!raw) return null;

    return JSON.parse(raw);
  } catch (err) {
    console.warn('[FeedCache] Failed to read followed authors cache:', err);
    return null;
  }
}

/**
 * Persists followed authors state.
 */
export function saveFollowedAuthorsToCache(followed: Record<string, boolean>): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    window.localStorage.setItem(FOLLOWED_AUTHORS_KEY, JSON.stringify(followed));
    return true;
  } catch (err) {
    console.warn('[FeedCache] Failed to save followed authors cache:', err);
    return false;
  }
}

/**
 * Human-readable relative time for cache stamp
 */
export function formatCacheTimestamp(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
