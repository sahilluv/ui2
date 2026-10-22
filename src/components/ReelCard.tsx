import React, { useRef, useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserCheck,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { ReelItem } from '../data/mockData';
import { PawnRankBadge } from './PawnRankBadge';
import { PreloadStatus } from '../utils/reelPreloader';
import { ReelCircularProgress } from './ReelCircularProgress';

interface ReelCardProps {
  reel: ReelItem;
  index: number;
  isActive: boolean;
  isNext: boolean;
  preloadStatus?: PreloadStatus;
  isNavShrunk: boolean;
  isDark: boolean;
  isFollowing: boolean;
  poppingBookmarkId: string | null;
  heartBurstId: string | null;
  isSwipingReel?: boolean;
  reelSwipeDeltaX?: number;
  onTouchStart?: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchMove?: (e: React.TouchEvent | React.MouseEvent) => void;
  onTouchEnd?: () => void;
  onTouchLeave?: () => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToggleFollow: (username: string) => void;
  onOpenComments: (reel: ReelItem) => void;
  onOpenShare: (reel: ReelItem) => void;
  onNavigateProfile: () => void;
  onToast: (msg: string, icon?: 'sparkles' | 'bookmark') => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  reel,
  index,
  isActive,
  isNext,
  preloadStatus,
  isNavShrunk,
  isDark,
  isFollowing,
  poppingBookmarkId,
  heartBurstId,
  isSwipingReel = false,
  reelSwipeDeltaX = 0,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchLeave,
  registerRef,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenShare,
  onNavigateProfile,
  onToast,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayPauseFeedback, setShowPlayPauseFeedback] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Connect DOM ref to IntersectionObserver
  useEffect(() => {
    if (cardRef.current) {
      registerRef(reel.id, cardRef.current);
    }
    return () => {
      registerRef(reel.id, null);
    };
  }, [reel.id, registerRef]);

  // Handle tap / double tap
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapTime < 300) {
      // Double tap: Like reel
      onToggleLike(reel.id);
    } else {
      // Single tap: Play/Pause toggle
      setIsPlaying((prev) => !prev);
      setShowPlayPauseFeedback(true);
      setTimeout(() => setShowPlayPauseFeedback(false), 800);
    }
    setLastTapTime(now);
  };

  return (
    <div
      ref={cardRef}
      data-reel-id={reel.id}
      onClick={handleCardClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchLeave}
      className="snap-start snap-always shrink-0 relative w-full h-[780px] overflow-hidden select-none cursor-pointer"
      style={{
        background: reel.gradient,
        transform: isSwipingReel && Math.abs(reelSwipeDeltaX) > 8 ? `translateX(${reelSwipeDeltaX * 0.35}px)` : undefined,
        transition: isSwipingReel ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Swipe Right Visual Cue: Return to Feed */}
      {isSwipingReel && reelSwipeDeltaX > 20 && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-[10px] text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95">
          <ChevronLeft size={16} className="text-white" />
          <span>Return to Feed</span>
        </div>
      )}

      {/* Swipe Left Visual Cue: View Creator Profile */}
      {isSwipingReel && reelSwipeDeltaX < -20 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-[10px] text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95">
          <span>@{reel.author.username}</span>
          <ChevronRight size={16} className="text-white" />
        </div>
      )}
      {/* Background Poster Image if provided */}
      {reel.posterUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={reel.posterUrl}
            alt={reel.caption || reel.author.name}
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              isActive || isNext ? 'opacity-30 blur-xs scale-105' : 'opacity-20 blur-sm'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Play / Pause Central Ripple Indicator */}
      {showPlayPauseFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-75 duration-200">
          <div className="w-16 h-16 rounded-[16px] bg-black/65 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
            {isPlaying ? <Play size={28} className="ml-1 fill-white" /> : <Pause size={28} className="fill-white" />}
          </div>
        </div>
      )}

      {/* Big Blooming Heart Burst on Double Tap */}
      {heartBurstId === reel.id && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <Heart
            size={110}
            className="fill-white text-white animate-heart-burst drop-shadow-[0_0_28px_rgba(255,255,255,0.85)]"
          />
        </div>
      )}

      {/* TOP OVERLAY: Creator Info, Badges, Follow button & Options */}
      <div className="absolute top-0 left-0 right-0 pt-10 px-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-8 pointer-events-auto">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNavigateProfile();
          }}
        >
          <div
            className="w-10 h-10 rounded-[12px] p-[2px] shadow-lg shrink-0"
            style={{ background: reel.author.avatarGradient }}
          >
            <div className="w-full h-full rounded-[10px] bg-slate-900/90 flex items-center justify-center">
              <div
                className="w-full h-full rounded-[8px]"
                style={{ background: reel.author.avatarGradient }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-white text-sm font-extrabold tracking-tight drop-shadow-md leading-tight">
                {reel.author.name}
              </h3>
              <PawnRankBadge
                variant="compact"
                onClick={(e) => {
                  e?.stopPropagation?.();
                  onToast('Shadow Rank: PAWN (Rank I)', 'sparkles');
                }}
              />
              {/* Inline Follow / Following Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow(reel.author.username);
                }}
                style={{ borderColor: '#ff0a78' }}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] text-[10px] font-bold transition-all active:scale-90 cursor-pointer border border-[#FF0A78] ${
                  isFollowing
                    ? 'bg-black/50 text-[#FF0A78] backdrop-blur-md border-[#FF0A78]'
                    : 'bg-[#FF0A78] hover:bg-[#E1306C] text-white shadow-md border-[#FF0A78]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={10} />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={10} />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-white/80 text-[11px] font-medium leading-tight mt-0.5 drop-shadow-sm">
              {reel.author.location}
            </p>
          </div>
        </div>

        {/* Right Header Buttons: Audio mute & Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((prev) => !prev);
              onToast(isMuted ? 'Audio unmuted 🔊' : 'Audio muted 🔇');
            }}
            className="w-8 h-8 rounded-[10px] bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare(reel);
            }}
            className="w-8 h-8 rounded-[10px] bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/60 transition-colors cursor-pointer"
            title="Options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Bottom Info Overlay: Caption & Music Ticker */}
      <div className="absolute bottom-28 left-6 right-6 z-20 pointer-events-auto flex flex-col gap-2">
        {reel.caption && (
          <p className="text-white/95 text-xs font-semibold leading-relaxed drop-shadow-md max-w-[85%]">
            {reel.caption}
          </p>
        )}

        {/* Audio Track Ticker */}
        {reel.audioTrack && (
          <div className="flex items-center gap-2 py-1 px-3 rounded-[10px] bg-black/45 backdrop-blur-md border border-white/15 self-start text-[10px] text-white/90 shadow-md">
            <Music size={11} className="text-white shrink-0 animate-pulse" />
            <span className="truncate max-w-[210px] font-medium">
              {reel.audioTrack}
            </span>
          </div>
        )}
      </div>

      {/* Floating Engagement Capsule Pill: Centered matt black / white pill */}
      <div
        className={`absolute ${
          isNavShrunk ? 'bottom-16' : 'bottom-22'
        } left-0 right-0 flex justify-center z-20 pointer-events-auto select-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]`}
      >
        <div className="bg-[#121212] rounded-[18px] px-5 py-2.5 shadow-2xl flex items-center gap-3.5 border border-white/10 select-none text-white">
          {/* Heart Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(reel.id);
            }}
            className="flex items-center gap-2 group cursor-pointer active:scale-90 transition-transform"
          >
            <Heart
              size={18}
              className={
                reel.isLiked
                  ? 'fill-white text-white'
                  : 'text-neutral-400 group-hover:text-white'
              }
            />
            <span className="text-xs font-black text-white">
              {reel.likes}
            </span>
          </button>

          {/* Divider 1 */}
          <span className="w-[1px] h-4 bg-white/20" />

          {/* Comment Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(reel);
            }}
            className="flex items-center gap-2 group cursor-pointer active:scale-90 transition-transform"
          >
            <MessageCircle
              size={17}
              className="text-neutral-400 group-hover:text-white"
            />
            <span className="text-xs font-black text-white">
              {reel.comments}
            </span>
          </button>

          {/* Divider 2 */}
          <span className="w-[1px] h-4 bg-white/20" />

          {/* Bookmark Button with Pop Animation */}
          <div className="relative flex items-center justify-center">
            {poppingBookmarkId === reel.id && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                <Bookmark
                  size={22}
                  className="fill-white text-white animate-bookmark-pop drop-shadow-[0_4px_12px_rgba(255,255,255,0.7)]"
                />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(reel.id);
              }}
              aria-label={reel.isSaved ? 'Reel saved • Click to remove' : 'Save Reel'}
              title={reel.isSaved ? 'Reel saved • Click to remove' : 'Save Reel'}
              className="cursor-pointer active:scale-85 transition-all p-1"
            >
              <Bookmark
                size={18}
                className={`transition-all duration-200 ${
                  reel.isSaved
                    ? 'fill-white text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Circular Progress Indicator Overlaying Bottom Right Corner */}
      <ReelCircularProgress
        isActive={isActive}
        isPlaying={isPlaying}
        onTogglePlayPause={() => {
          setIsPlaying((prev) => !prev);
          setShowPlayPauseFeedback(true);
          setTimeout(() => setShowPlayPauseFeedback(false), 800);
        }}
        isNavShrunk={isNavShrunk}
        onToast={onToast}
        reelId={reel.id}
      />
    </div>
  );
};
