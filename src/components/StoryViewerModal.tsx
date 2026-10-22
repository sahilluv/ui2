import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  X,
  Heart,
  Send,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { StoryItem } from '../data/mockData';

export interface StoryViewerModalProps {
  story: StoryItem | null;
  stories?: StoryItem[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  duration?: number; // duration per story in milliseconds, defaults to 5000ms
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  stories,
  onClose,
  onNext,
  onPrev,
  duration = 5000,
}) => {
  // Animation states: slide up on enter, slide down on exit
  const [isRendered, setIsRendered] = useState(false);
  const [isSlidIn, setIsSlidIn] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Swipe-to-close gesture state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  // Story interactive state
  const [progress, setProgress] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Drag tracking refs
  const dragStartYRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const isDragInitiatedRef = useRef(false);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // High precision timer engine refs
  const accumulatedTimeRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Determine full stories sequence and active index
  const storyList = stories && stories.length > 0 ? stories : story ? [story] : [];
  const currentIndex = story ? storyList.findIndex((s) => s.id === story.id) : 0;
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  // Handle slide-up mounting & slide-down unmounting lifecycle
  useEffect(() => {
    if (story) {
      setIsRendered(true);
      setIsExiting(false);
      setDragY(0);
      setIsDragging(false);

      // Trigger bottom-to-top slide up on next tick
      const frame = requestAnimationFrame(() => {
        setIsSlidIn(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsSlidIn(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [story]);

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 2200);
  }, []);

  // Smooth slide-down exit handler
  const triggerClose = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setIsSlidIn(false);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
      setIsRendered(false);
      setDragY(0);
      setIsDragging(false);
    }, 280);
  }, [isExiting, onClose]);

  // Story Navigation
  const handleNextStory = useCallback(() => {
    if (onNext) {
      onNext();
    } else {
      triggerClose();
    }
  }, [onNext, triggerClose]);

  const handlePrevStory = useCallback(() => {
    if (progress > 20) {
      // If user viewed > 20% of current story, restart current story
      setProgress(0);
      accumulatedTimeRef.current = 0;
      lastTimeRef.current = performance.now();
    } else if (onPrev) {
      onPrev();
    }
  }, [progress, onPrev]);

  // Reset timer whenever the active story changes
  useEffect(() => {
    if (!story) return;
    setProgress(0);
    accumulatedTimeRef.current = 0;
    lastTimeRef.current = performance.now();
    setIsLiked(false);
  }, [story?.id]);

  // Automated 60fps Time Progress Bar Engine
  useEffect(() => {
    if (!story || isExiting || !isSlidIn) return;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Only advance progress if user is not holding down, not dragging down, and not typing
      if (!isHolding && !isDragging && !isReplying) {
        accumulatedTimeRef.current += delta;
        const currentProgress = Math.min(100, (accumulatedTimeRef.current / duration) * 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          accumulatedTimeRef.current = 0;
          handleNextStory();
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [story?.id, isHolding, isDragging, isReplying, isExiting, isSlidIn, duration, handleNextStory]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!story || isExiting) return;
      if (e.key === 'Escape') {
        triggerClose();
      } else if (e.key === 'ArrowRight') {
        handleNextStory();
      } else if (e.key === 'ArrowLeft') {
        handlePrevStory();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsHolding((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [story, isExiting, triggerClose, handleNextStory, handlePrevStory]);

  // Swipe-to-Close Gestures (Pointer / Touch Event Handlers)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Ignore clicks on form inputs or interactive buttons
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, form, a')) {
      return;
    }

    isPointerDownRef.current = true;
    isDragInitiatedRef.current = false;
    dragStartYRef.current = e.clientY;
    dragStartTimeRef.current = performance.now();

    // Hold-to-pause detection
    holdTimeoutRef.current = setTimeout(() => {
      if (isPointerDownRef.current && !isDragInitiatedRef.current) {
        setIsHolding(true);
      }
    }, 140);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const deltaY = e.clientY - dragStartYRef.current;

    // If dragged more than 6px vertically, initiate downward swipe gesture
    if (deltaY > 6) {
      isDragInitiatedRef.current = true;
      setIsDragging(true);
      setIsHolding(false);

      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }

      // 1:1 translation downward
      setDragY(deltaY);
    } else if (deltaY < -4) {
      // Elastic resistance when dragging upward
      setDragY(deltaY * 0.15);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    isPointerDownRef.current = false;

    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (isDragging) {
      const elapsed = performance.now() - dragStartTimeRef.current;
      const velocityY = (e.clientY - dragStartYRef.current) / Math.max(1, elapsed);

      // Dismiss threshold: dragged > 90px OR fast flick downwards (> 0.45 px/ms)
      if (dragY > 90 || (dragY > 35 && velocityY > 0.45)) {
        triggerClose();
      } else {
        // Snap back up
        setDragY(0);
        setIsDragging(false);
      }
    }

    setIsHolding(false);
    lastTimeRef.current = performance.now();
  };

  const handlePointerCancel = () => {
    isPointerDownRef.current = false;
    isDragInitiatedRef.current = false;
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    setDragY(0);
    setIsDragging(false);
    setIsHolding(false);
    lastTimeRef.current = performance.now();
  };

  // Interactions: Reply, Likes, Floating Emojis
  const handleSendReply = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Reply sent to @${story?.username}!`);
    setReplyText('');
    setIsReplying(false);
  };

  const handleToggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    if (next) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
      showToast('Reacted with heart ❤️');
    }
  };

  const handleQuickReaction = (emoji: string) => {
    const newEmoji: FloatingEmoji = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      emoji,
      x: 35 + Math.random() * 30, // Random percentage within container
    };

    setFloatingEmojis((prev) => [...prev, newEmoji]);
    showToast(`Reacted with ${emoji}`);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
    }, 1200);
  };

  if (!isRendered && !story) return null;

  // Compute gesture physics for translation and opacity
  const activeStoryItem = story || storyList[0];
  const effectiveDragY = Math.max(0, dragY);
  const dragOpacity = Math.max(0.2, 1 - effectiveDragY / 400);
  const dragScale = Math.max(0.92, 1 - effectiveDragY / 2200);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Story by ${activeStoryItem?.username || 'Creator'}`}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center select-none transition-opacity duration-300 ${
        isSlidIn && !isExiting ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${0.85 * dragOpacity})`,
        backdropFilter: 'blur(16px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          triggerClose();
        }
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-full bg-[#121422]/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles size={14} className="text-[#FF0A78]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Left/Right Side Nav Buttons */}
      {storyList.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevStory();
            }}
            disabled={activeIndex === 0 && progress <= 20}
            className={`hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full items-center justify-center transition-all ${
              activeIndex === 0 && progress <= 20
                ? 'bg-white/10 text-white/30 cursor-not-allowed'
                : 'bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md border border-white/20 cursor-pointer shadow-xl'
            }`}
            title="Previous Story"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextStory();
            }}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full items-center justify-center bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md border border-white/20 cursor-pointer shadow-xl transition-all"
            title="Next Story"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Main Story Container (Slides up from the bottom + Swipe-down to close physics) */}
      <div
        className={`relative w-full max-w-[400px] h-[92vh] max-h-[780px] sm:h-[720px] rounded-t-[36px] sm:rounded-[38px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between p-4 sm:p-5 border-t sm:border border-white/20 touch-none ${
          isDragging ? '' : 'transition-transform duration-300 ease-out'
        }`}
        style={{
          background: activeStoryItem?.gradient || 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
          transform: `translate3d(0, ${
            !isSlidIn || isExiting ? '100%' : `${effectiveDragY}px`
          }, 0) scale(${dragScale})`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Render Captured / Reference Story Photo Background */}
        {activeStoryItem?.storyImageUrl && (
          <img
            src={activeStoryItem.storyImageUrl}
            alt="Story visual content"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          />
        )}

        {/* Cinematic Scrim Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85 z-0 pointer-events-none" />

        {/* Heart Burst on Reaction */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart
              size={120}
              className="fill-[#FF0A78] text-white animate-heart-burst drop-shadow-[0_0_36px_rgba(255,10,120,0.9)]"
            />
          </div>
        )}

        {/* Floating Emoji Particles on Quick Reaction */}
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-24 text-3xl pointer-events-none z-40 animate-float-reaction drop-shadow-lg"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </div>
        ))}

        {/* TOP SECTION: Drag Handle Affordance + Progress Bar + Author Header */}
        <div className="w-full z-20 flex flex-col gap-2 pointer-events-none">
          {/* Swipe-to-Close Drag Handle */}
          <div className="w-full flex flex-col items-center justify-center pb-1 pointer-events-auto cursor-grab active:cursor-grabbing">
            <div
              className={`w-12 h-1.5 rounded-full transition-colors ${
                isDragging ? 'bg-white/80 w-16' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
            {isDragging && (
              <span className="text-[9.5px] font-bold text-white/80 mt-1 uppercase tracking-widest animate-in fade-in">
                Release to close
              </span>
            )}
          </div>

          {/* Segmented Auto-Advancing Time Progress Bars */}
          <div className="w-full flex items-center gap-1.5 px-0.5">
            {storyList.map((item, idx) => {
              let segmentPercent = 0;
              if (idx < activeIndex) {
                segmentPercent = 100;
              } else if (idx === activeIndex) {
                segmentPercent = progress;
              } else {
                segmentPercent = 0;
              }

              return (
                <div
                  key={item.id || idx}
                  className="flex-1 bg-white/25 backdrop-blur-xs h-[2.5px] rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white rounded-full ${
                      idx === activeIndex ? 'shadow-[0_0_8px_rgba(255,255,255,0.9)]' : ''
                    }`}
                    style={{
                      width: `${segmentPercent}%`,
                      transition: idx === activeIndex ? 'none' : 'width 0.15s ease-out',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Top Header: Author Avatar, Username, Status, Pause pill, Audio & Close button */}
          <div className="flex items-center justify-between pointer-events-auto pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Creator Avatar (Curved-Square Design System) */}
              <div
                className="w-9 h-9 rounded-[12px] border border-white/90 p-[1px] flex items-center justify-center shadow-md shrink-0 overflow-hidden"
                style={{ background: activeStoryItem?.avatarGradient }}
              >
                {activeStoryItem?.avatarUrl ? (
                  <img
                    src={activeStoryItem.avatarUrl}
                    alt={activeStoryItem.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-[10px] object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-[10px] bg-black/20" />
                )}
              </div>

              {/* Author Title & Timestamp */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-white text-xs sm:text-sm font-extrabold tracking-tight drop-shadow-md truncate">
                    {activeStoryItem?.username}
                  </p>
                  {activeStoryItem?.isCurrentUser && (
                    <span className="text-[8.5px] font-black bg-gradient-to-r from-[#FF0A78] to-[#8A2BE2] text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                      24h
                    </span>
                  )}
                </div>
                <p className="text-white/75 text-[10.5px] font-medium leading-tight">
                  {activeStoryItem?.storyTimestamp || 'Just now'}
                </p>
              </div>
            </div>

            {/* Right Header Action Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Visual Pause Status Badge */}
              {isHolding && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 animate-in fade-in duration-150">
                  <Pause size={10} className="fill-white" />
                  <span>Paused</span>
                </div>
              )}

              {/* Audio Mute/Unmute */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                  showToast(isMuted ? 'Audio unmuted 🔊' : 'Audio muted 🔇');
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 active:scale-90"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerClose();
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 active:scale-90"
                title="Close Story (Esc or Swipe down)"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* TAP NAVIGATION ZONES: Left 32% (Previous / Restart), Right 68% (Next Story) */}
        <div className="absolute inset-x-0 top-20 bottom-28 flex z-10">
          <div
            className="w-[32%] h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevStory();
            }}
            title="Tap left for Previous / Restart"
          />
          <div
            className="w-[68%] h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNextStory();
            }}
            title="Tap right for Next"
          />
        </div>

        {/* CENTER CONTENT: Story Sticker, Caption or Artwork Card */}
        <div className="self-center text-center z-20 pointer-events-none my-auto max-w-[90%] px-2">
          {activeStoryItem?.storySticker && (
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white text-xs font-black shadow-2xl mb-3 tracking-wide">
              {activeStoryItem.storySticker}
            </div>
          )}

          {activeStoryItem?.storyCaption ? (
            <div className="inline-block px-5 py-3 rounded-2xl bg-black/65 backdrop-blur-md border border-white/25 shadow-2xl">
              <p className="text-white text-sm sm:text-base font-extrabold tracking-wide drop-shadow-md leading-relaxed">
                {activeStoryItem.storyCaption}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="text-white text-2xl sm:text-3xl font-black tracking-tight drop-shadow-lg">
                SHADOW STORIES
              </h2>
              <p className="text-white/80 text-[11px] font-mono uppercase tracking-[0.2em]">
                {activeIndex + 1} of {storyList.length} • 24H EXCLUSIVE
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM INTERACTION BAR: Quick Emoji Reactions, Reply Composer & Heart */}
        <div className="relative z-20 flex flex-col gap-2 pt-2 pointer-events-auto">
          {/* Quick Reaction Emoji Strip */}
          <div className="flex items-center justify-center gap-3 py-1">
            {['🔥', '❤️', '👏', '⚡', '🤯'].map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickReaction(emoji);
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 hover:scale-125 active:scale-90 text-sm flex items-center justify-center border border-white/15 backdrop-blur-md transition-transform cursor-pointer shadow-sm"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Form & Heart Button */}
          <form
            onSubmit={handleSendReply}
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input field (pauses auto-progress while typing so story doesn't skip) */}
            <div className="flex-1 bg-black/40 hover:bg-black/55 focus-within:bg-black/65 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 transition-all flex items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsReplying(true)}
                onBlur={() => {
                  setIsReplying(false);
                  lastTimeRef.current = performance.now();
                }}
                placeholder={`Reply to @${activeStoryItem?.username || 'user'}...`}
                className="w-full bg-transparent text-white placeholder-white/60 text-xs focus:outline-none"
              />
            </div>

            {/* Heart Reaction Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-85 border ${
                isLiked
                  ? 'bg-[#FF0A78] text-white border-[#FF0A78] shadow-md shadow-[#FF0A78]/40'
                  : 'bg-black/40 hover:bg-black/60 text-white border-white/20'
              }`}
              title="Like Story"
            >
              <Heart
                size={17}
                className={`transition-transform duration-200 ${
                  isLiked ? 'fill-white scale-110' : 'text-white'
                }`}
              />
            </button>

            {/* Send Reply Button */}
            <button
              type="submit"
              disabled={!replyText.trim()}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-85 border ${
                replyText.trim()
                  ? 'bg-gradient-to-r from-[#FF0A78] to-[#8A2BE2] text-white border-[#FF0A78] shadow-md shadow-[#FF0A78]/30'
                  : 'bg-black/40 text-white/50 border-white/10 cursor-default'
              }`}
              title="Send reply"
            >
              <Send size={15} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
