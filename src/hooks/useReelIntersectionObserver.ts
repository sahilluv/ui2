import { useEffect, useRef, useState, useCallback } from 'react';
import { ReelItem } from '../data/mockData';
import { preloadReelMedia, subscribeToPreloadStatus, PreloadStatus } from '../utils/reelPreloader';

interface UseReelIntersectionObserverOptions {
  containerRef?: React.RefObject<HTMLElement | null>;
  reels: ReelItem[];
  threshold?: number;
  onActiveChange?: (activeReel: ReelItem, activeIndex: number) => void;
}

export function useReelIntersectionObserver({
  containerRef,
  reels,
  threshold = 0.6,
  onActiveChange,
}: UseReelIntersectionObserverOptions) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [preloadedStatusMap, setPreloadedStatusMap] = useState<Map<string, PreloadStatus>>(new Map());
  const reelElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Subscribe to preload events
  useEffect(() => {
    const unsubscribe = subscribeToPreloadStatus((newMap) => {
      setPreloadedStatusMap(newMap);
    });
    return unsubscribe;
  }, []);

  // Preload initial first reel and second reel on mount
  useEffect(() => {
    if (reels.length > 0) {
      preloadReelMedia(reels[0]);
    }
    if (reels.length > 1) {
      // Background idle preload for next reel
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          preloadReelMedia(reels[1]);
        });
      } else {
        setTimeout(() => {
          preloadReelMedia(reels[1]);
        }, 150);
      }
    }
  }, [reels]);

  // Set up intersection observer
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            const reelId = entry.target.getAttribute('data-reel-id');
            if (!reelId) return;

            const index = reels.findIndex((r) => r.id === reelId);
            if (index !== -1) {
              setActiveIndex(index);
              const currentReel = reels[index];
              onActiveChange?.(currentReel, index);

              // ⚡ PERFORMANCE OPTIMIZATION:
              // Pre-load the NEXT reel's media content in the background
              // while the user is still viewing the current reel.
              const nextIndex = index + 1;
              if (nextIndex < reels.length) {
                const nextReel = reels[nextIndex];
                
                // Use requestIdleCallback for non-blocking background prefetch
                if ('requestIdleCallback' in window) {
                  (window as any).requestIdleCallback(() => {
                    preloadReelMedia(nextReel);
                  }, { timeout: 1000 });
                } else {
                  setTimeout(() => {
                    preloadReelMedia(nextReel);
                  }, 50);
                }
              }

              // Also ensure previous reel remains primed for smooth reverse scroll
              const prevIndex = index - 1;
              if (prevIndex >= 0) {
                preloadReelMedia(reels[prevIndex]);
              }
            }
          }
        });
      },
      {
        root: containerRef?.current || null,
        rootMargin: '0px 0px 80px 0px',
        threshold: [threshold],
      }
    );

    observerRef.current = observer;

    // Observe all registered reel DOM nodes
    reelElementsRef.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [reels, threshold, containerRef, onActiveChange]);

  const registerReelRef = useCallback((reelId: string, el: HTMLElement | null) => {
    if (el) {
      reelElementsRef.current.set(reelId, el);
      observerRef.current?.observe(el);
    } else {
      const prevEl = reelElementsRef.current.get(reelId);
      if (prevEl && observerRef.current) {
        observerRef.current.unobserve(prevEl);
      }
      reelElementsRef.current.delete(reelId);
    }
  }, []);

  const nextReel = activeIndex + 1 < reels.length ? reels[activeIndex + 1] : null;
  const isNextPreloaded = nextReel ? preloadedStatusMap.has(nextReel.id) : false;

  return {
    activeIndex,
    activeReel: reels[activeIndex] || null,
    nextReel,
    isNextPreloaded,
    preloadedStatusMap,
    registerReelRef,
  };
}
