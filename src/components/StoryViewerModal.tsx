import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Heart, Send, Pause, Play, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { StoryItem } from '../data/mockData';

export interface StoryViewerModalProps {
  story: StoryItem | null;
  stories?: StoryItem[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  duration?: number; // duration per story in milliseconds, defaults to 5000ms
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  stories,
  onClose,
  onNext,
  onPrev,
  duration = 5000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine full stories sequence and active index
  const storyList = stories && stories.length > 0 ? stories : story ? [story] : [];
  const currentIndex = story ? storyList.findIndex((s) => s.id === story.id) : 0;
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  // Refs for smooth 60fps timer tracking
  const accumulatedTimeRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const holdStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const handleNextStory = useCallback(() => {
    if (onNext) {
      onNext();
    } else {
      onClose();
    }
  }, [onNext, onClose]);

  const handlePrevStory = useCallback(() => {
    if (progress > 20) {
      // If user has viewed > 20% of the story, restart this current story
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
    if (!story) return;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Only advance progress if user is not pressing down / holding and not typing in reply field
      if (!isHolding && !isReplying) {
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
  }, [story?.id, isHolding, isReplying, duration, handleNextStory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!story) return;
      if (e.key === 'Escape') {
        onClose();
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
  }, [story, onClose, handleNextStory, handlePrevStory]);

  // Pointer hold handlers (Touch-and-Hold to Pause)
  const handlePointerDown = () => {
    holdStartTimeoutRef.current = setTimeout(() => {
      setIsHolding(true);
    }, 120);
  };

  const handlePointerUp = () => {
    if (holdStartTimeoutRef.current) {
      clearTimeout(holdStartTimeoutRef.current);
      holdStartTimeoutRef.current = null;
    }
    setIsHolding(false);
    lastTimeRef.current = performance.now();
  };

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
      showToast(`Reacted with heart to story ❤️`);
    }
  };

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 select-none animate-in fade-in duration-200"
      onPointerUp={handlePointerUp}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-full bg-[#121422]/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl border border-[#7B52B9]/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles size={14} className="text-[#7B52B9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Story Container (Curved Mobile Aspect) */}
      <div
        className="relative w-full max-w-[380px] h-[690px] rounded-[38px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between p-4 sm:p-5 border border-white/15"
        style={{ background: story.gradient }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Render Captured Story Photo Background if available */}
        {story.storyImageUrl && (
          <img
            src={story.storyImageUrl}
            alt="Story snapshot"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          />
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75 z-0 pointer-events-none" />

        {/* Heart Burst on reaction */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart
              size={110}
              className="fill-[#FF2A55] text-white animate-heart-burst drop-shadow-[0_0_32px_rgba(255,42,85,0.9)]"
            />
          </div>
        )}

        {/* TOP SECTION: Automated Segmented Time-Progress Bars */}
        <div className="w-full z-20 flex flex-col gap-2.5">
          {/* Segmented Time Progress Bars */}
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
                  className="flex-1 bg-white/25 backdrop-blur-xs h-1 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white rounded-full ${
                      idx === activeIndex
                        ? 'shadow-[0_0_8px_rgba(255,255,255,0.9)]'
                        : ''
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
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar (Curved Square) */}
              <div
                className="w-9 h-9 rounded-[11px] border-2 border-white/90 p-0.5 flex items-center justify-center shadow-md shrink-0 overflow-hidden"
                style={{ background: story.avatarGradient }}
              >
                {story.avatarUrl ? (
                  <img
                    src={story.avatarUrl}
                    alt={story.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-[8px] object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-[9px] bg-black/20" />
                )}
              </div>

              {/* Author Title & Timestamp */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-white text-xs sm:text-sm font-extrabold tracking-tight drop-shadow-md truncate">
                    {story.username}
                  </p>
                  {story.isCurrentUser && (
                    <span className="text-[8.5px] font-black bg-gradient-to-r from-[#7B52B9] to-[#5E3A89] text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                      24h
                    </span>
                  )}
                </div>
                <p className="text-white/75 text-[10.5px] font-medium leading-tight">
                  {story.storyTimestamp || 'Just now'}
                </p>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Pause Pill (Appears when holding screen or paused) */}
              {isHolding && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 animate-in fade-in duration-150">
                  <Pause size={10} className="fill-white" />
                  <span>Paused</span>
                </div>
              )}

              {/* Audio Mute/Unmute Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((prev) => !prev);
                  showToast(isMuted ? 'Audio unmuted 🔊' : 'Audio muted 🔇');
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title="Close Story (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* TAP ZONES: Left 30% (Previous), Right 70% (Next) */}
        <div className="absolute inset-x-0 top-16 bottom-20 flex z-10">
          <div
            className="w-[32%] h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevStory();
            }}
            title="Previous story / Restart"
          />
          <div
            className="w-[68%] h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNextStory();
            }}
            title="Next story"
          />
        </div>

        {/* CENTER CONTENT: Story Sticker, Caption or Headline */}
        <div className="self-center text-center z-20 pointer-events-none my-auto max-w-[90%] px-2">
          {story.storySticker && (
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white text-xs font-black shadow-2xl mb-3 tracking-wide">
              {story.storySticker}
            </div>
          )}

          {story.storyCaption ? (
            <div className="inline-block px-5 py-3 rounded-2xl bg-black/65 backdrop-blur-md border border-white/25 shadow-2xl">
              <p className="text-white text-sm sm:text-base font-extrabold tracking-wide drop-shadow-md leading-relaxed">
                {story.storyCaption}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="text-white text-2xl sm:text-3xl font-black tracking-tight drop-shadow-lg">
                SHADOW STORIES
              </h2>
              <p className="text-white/80 text-[11px] font-mono uppercase tracking-[0.2em]">
                {activeIndex + 1} of {storyList.length} • Visual Artwork
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM INTERACTION BAR: Reply composer & Reaction Buttons */}
        <div className="relative z-20 pt-3 pointer-events-auto">
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
                placeholder={`Reply to @${story.username}...`}
                className="w-full bg-transparent text-white placeholder-white/60 text-xs focus:outline-none"
              />
            </div>

            {/* Heart Reaction Button */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-85 border ${
                isLiked
                  ? 'bg-[#7B52B9]/90 text-white border-[#7B52B9] shadow-md shadow-[#7B52B9]/40'
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
                  ? 'bg-gradient-to-r from-[#7B52B9] to-[#5E3A89] text-white border-[#7B52B9] shadow-md shadow-[#7B52B9]/30'
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
