import React, { useState } from 'react';
import {
  X,
  Heart,
  Send,
  Sparkles,
  MessageCircle,
  UserPlus,
  UserCheck,
  CornerDownRight,
} from 'lucide-react';
import { ReelItem } from '../data/mockData';

export interface ReelCommentReply {
  id: string;
  commentId: string;
  author: {
    name: string;
    username: string;
    avatarGradient: string;
  };
  text: string;
  timeAgo: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface ReelComment {
  id: string;
  reelId: string;
  author: {
    name: string;
    username: string;
    avatarGradient: string;
  };
  text: string;
  timeAgo: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: ReelCommentReply[];
}

const DEFAULT_COMMENTS: ReelComment[] = [
  {
    id: 'c1',
    reelId: 'reel_eliott',
    author: {
      name: 'Marco Rossi',
      username: 'marco.visuals',
      avatarGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #3B82F6 100%)',
    },
    text: 'The natural light and color palette in Madrid are stunning! Unreal shot 🔥',
    timeAgo: '15m',
    likesCount: 24,
    isLiked: false,
    replies: [
      {
        id: 'r1_1',
        commentId: 'c1',
        author: {
          name: 'Eliott Johnson',
          username: 'eliott.j',
          avatarGradient: 'linear-gradient(135deg, #7B52B9 0%, #8456C5 100%)',
        },
        text: 'Thanks Marco! Golden hour around Gran Vía never misses 🙌',
        timeAgo: '10m',
        likesCount: 8,
        isLiked: false,
      },
    ],
  },
  {
    id: 'c2',
    reelId: 'reel_eliott',
    author: {
      name: 'Clara Design',
      username: 'clara_design',
      avatarGradient: 'linear-gradient(135deg, #7B52B9 0%, #D4C4EB 100%)',
    },
    text: 'What lens and camera did you use for that smooth transition? Looks cinematic.',
    timeAgo: '42m',
    likesCount: 18,
    isLiked: true,
    replies: [
      {
        id: 'r2_1',
        commentId: 'c2',
        author: {
          name: 'Eliott Johnson',
          username: 'eliott.j',
          avatarGradient: 'linear-gradient(135deg, #7B52B9 0%, #8456C5 100%)',
        },
        text: 'Shot on 35mm f/1.4 prime with a 1/8 black mist filter!',
        timeAgo: '30m',
        likesCount: 6,
        isLiked: true,
      },
    ],
  },
  {
    id: 'c3',
    reelId: 'reel_eliott',
    author: {
      name: 'Sofia Martinez',
      username: 'sofia.mtz',
      avatarGradient: 'linear-gradient(135deg, #FF6B4A 0%, #FF3366 100%)',
    },
    text: 'That combination of violet and golden tones is pure visual poetry ✨🙌',
    timeAgo: '2h',
    likesCount: 9,
    isLiked: false,
    replies: [],
  },
  {
    id: 'c4',
    reelId: 'reel_christian',
    author: {
      name: 'Lucas Vane',
      username: 'lucas.vane',
      avatarGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    },
    text: 'Ghent in autumn has such an unmatched atmosphere. Great earthy tones 🤎',
    timeAgo: '1h',
    likesCount: 14,
    isLiked: false,
    replies: [],
  },
];

const QUICK_EMOJIS = ['❤️', '🔥', '👏', '🙌', '✨', '😍'];

interface ReelCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reel: ReelItem | null;
  isDark?: boolean;
  onCommentAdded?: (reelId: string, text: string) => void;
}

export const ReelCommentsDrawer: React.FC<ReelCommentsDrawerProps> = ({
  isOpen,
  onClose,
  reel,
  isDark = true,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<ReelComment[]>(DEFAULT_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>({
    'marco.visuals': false,
    'clara_design': true,
    'sofia.mtz': false,
    'lucas.vane': false,
  });
  const [poppingCommentIds, setPoppingCommentIds] = useState<Record<string, boolean>>({});

  // Reply-to state
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    username: string;
  } | null>(null);

  // Expanded replies state
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({
    c1: true,
    c2: false,
  });

  if (!isOpen || !reel) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleFollow = (username: string) => {
    const isNowFollowing = !followingUsers[username];
    setFollowingUsers((prev) => ({
      ...prev,
      [username]: isNowFollowing,
    }));
    showToast(isNowFollowing ? `Followed @${username}!` : `Unfollowed @${username}`);
  };

  const handleToggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextLiked = !c.isLiked;
          if (nextLiked) {
            setPoppingCommentIds((p) => ({ ...p, [id]: true }));
            setTimeout(() => {
              setPoppingCommentIds((p) => ({ ...p, [id]: false }));
            }, 750);
          }
          return {
            ...c,
            isLiked: nextLiked,
            likesCount: nextLiked ? c.likesCount + 1 : c.likesCount - 1,
          };
        }
        return c;
      })
    );
  };

  const handleToggleReplyLike = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.replies) {
          const updatedReplies = c.replies.map((r) => {
            if (r.id === replyId) {
              const nextLiked = !r.isLiked;
              if (nextLiked) {
                setPoppingCommentIds((p) => ({ ...p, [replyId]: true }));
                setTimeout(() => {
                  setPoppingCommentIds((p) => ({ ...p, [replyId]: false }));
                }, 750);
              }
              return {
                ...r,
                isLiked: nextLiked,
                likesCount: nextLiked ? r.likesCount + 1 : r.likesCount - 1,
              };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      })
    );
  };

  const handleStartReply = (targetComment: ReelComment, mentionUsername?: string) => {
    const targetUser = mentionUsername || targetComment.author.username;
    setReplyingTo({
      commentId: targetComment.id,
      username: targetUser,
    });
    setCommentText(`@${targetUser} `);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const toggleRepliesExpanded = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleAddComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    if (replyingTo) {
      // Add nested reply to target comment
      const newReply: ReelCommentReply = {
        id: `reply_${Date.now()}`,
        commentId: replyingTo.commentId,
        author: {
          name: 'You',
          username: 'your.profile',
          avatarGradient: 'linear-gradient(135deg, #7B52B9 0%, #8456C5 50%, #5E3A89 100%)',
        },
        text: trimmed,
        timeAgo: 'Just now',
        likesCount: 0,
        isLiked: false,
      };

      setComments((prev) =>
        prev.map((c) => {
          if (c.id === replyingTo.commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply],
            };
          }
          return c;
        })
      );

      // Auto-expand thread
      setExpandedReplies((prev) => ({
        ...prev,
        [replyingTo.commentId]: true,
      }));

      onCommentAdded?.(reel.id, trimmed);
      const targetUser = replyingTo.username;
      setCommentText('');
      setReplyingTo(null);
      showToast(`Replied to @${targetUser}!`);
      return;
    }

    // Top-level comment
    const newComment: ReelComment = {
      id: `comment_${Date.now()}`,
      reelId: reel.id,
      author: {
        name: 'You',
        username: 'your.profile',
        avatarGradient: 'linear-gradient(135deg, #7B52B9 0%, #8456C5 50%, #5E3A89 100%)',
      },
      text: trimmed,
      timeAgo: 'Just now',
      likesCount: 0,
      isLiked: false,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    onCommentAdded?.(reel.id, trimmed);
    setCommentText('');
    showToast('Comment posted!');
  };

  const handleAppendEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  const reelComments = comments.filter(
    (c) => c.reelId === reel.id || c.reelId === 'reel_eliott' || c.reelId === 'reel_1'
  );

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-full bg-[#12131D]/90 backdrop-blur-md text-white text-xs font-semibold shadow-2xl border border-[#7B52B9]/30 flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles size={14} className="text-[#7B52B9]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Sheet */}
      <div
        className={`relative w-full max-h-[82%] rounded-t-[32px] p-5 shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300 ${
          isDark
            ? 'bg-[#150A29] text-white border-t border-[#7B52B9]/30'
            : 'bg-white text-slate-900 border-t border-[#7B52B9]/20'
        }`}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-slate-400/40 self-center mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#7B52B9]/20 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{
                background:
                  'linear-gradient(135deg, #7B52B9 0%, #8456C5 50%, #5E3A89 100%)',
              }}
            >
              <MessageCircle size={15} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold tracking-tight">Comments</h4>
              <p className="text-[11px] text-slate-400">
                @{reel.author.username} • {reel.comments} comments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/15'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        {/* Comments Scrollable Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-4 pr-1">
          {reelComments.map((item) => (
            <div key={item.id} className="space-y-2">
              {/* Main Comment Row */}
              <div className="flex items-start gap-3 group">
                <div
                  className="w-8 h-8 rounded-full shrink-0 shadow-sm"
                  style={{ background: item.author.avatarGradient }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold truncate">
                      {item.author.username}
                    </span>
                    {item.author.username !== 'your.profile' && (
                      <button
                        onClick={() => handleToggleFollow(item.author.username)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all active:scale-90 cursor-pointer ${
                          followingUsers[item.author.username]
                            ? 'border border-[#7B52B9]/30 text-[#D4C4EB] bg-[#7B52B9]/15 hover:bg-[#7B52B9]/25'
                            : 'bg-black text-white hover:bg-neutral-800 shadow-xs'
                        }`}
                      >
                        {followingUsers[item.author.username] ? (
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
                    )}
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {item.text}
                  </p>

                  {/* Comment Actions: Reply button & View replies toggle */}
                  <div className="flex items-center gap-3.5 mt-1.5">
                    <button
                      onClick={() => handleStartReply(item)}
                      className="text-[11px] font-bold text-slate-400 hover:text-[#7B52B9] transition-colors cursor-pointer active:scale-95"
                    >
                      Reply
                    </button>
                    {item.replies && item.replies.length > 0 && (
                      <button
                        onClick={() => toggleRepliesExpanded(item.id)}
                        className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="w-3.5 h-[1px] bg-slate-500/60" />
                        <span>
                          {expandedReplies[item.id]
                            ? 'Hide replies'
                            : `View ${item.replies.length} ${item.replies.length === 1 ? 'reply' : 'replies'}`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Like comment button with relative container for mini heart pop */}
                <div className="relative pt-1">
                  {poppingCommentIds[item.id] && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                      <Heart
                        size={20}
                        className="fill-[#FF2A55] text-white animate-mini-heart-pop drop-shadow-[0_4px_12px_rgba(255,42,85,0.7)]"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className="flex flex-col items-center gap-0.5 shrink-0 text-slate-400 hover:text-[#FF2A55] active:scale-90 transition-all cursor-pointer"
                  >
                    <Heart
                      size={14}
                      className={
                        item.isLiked
                          ? 'fill-[#FF2A55] text-[#FF2A55] scale-110'
                          : 'hover:text-[#FF2A55]'
                      }
                    />
                    {item.likesCount > 0 && (
                      <span
                        className={`text-[9px] font-bold ${
                          item.isLiked ? 'text-[#FF2A55]' : 'text-slate-400'
                        }`}
                      >
                        {item.likesCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Nested Replies Thread */}
              {expandedReplies[item.id] && item.replies && item.replies.length > 0 && (
                <div className="mt-2 ml-4 pl-3.5 border-l-2 border-slate-700/40 space-y-3">
                  {item.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2.5 group">
                      <div
                        className="w-6 h-6 rounded-full shrink-0 shadow-xs"
                        style={{ background: reply.author.avatarGradient }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[11px] font-bold truncate">
                            {reply.author.username}
                          </span>
                          <span className="text-[9px] text-slate-400 ml-auto">
                            {reply.timeAgo}
                          </span>
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          }`}
                        >
                          {reply.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => handleStartReply(item, reply.author.username)}
                            className="text-[10px] font-bold text-slate-400 hover:text-[#7B52B9] transition-colors cursor-pointer active:scale-95"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                      {/* Like reply button with mini heart pop */}
                      <div className="relative pt-0.5">
                        {poppingCommentIds[reply.id] && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                            <Heart
                              size={18}
                              className="fill-[#FF2A55] text-white animate-mini-heart-pop drop-shadow-[0_4px_12px_rgba(255,42,85,0.7)]"
                            />
                          </div>
                        )}
                        <button
                          onClick={() => handleToggleReplyLike(item.id, reply.id)}
                          className="flex flex-col items-center gap-0.5 shrink-0 text-slate-400 hover:text-[#FF2A55] active:scale-90 transition-all cursor-pointer"
                        >
                          <Heart
                            size={12}
                            className={
                              reply.isLiked
                                ? 'fill-[#FF2A55] text-[#FF2A55] scale-110'
                                : 'hover:text-[#FF2A55]'
                            }
                          />
                          {reply.likesCount > 0 && (
                            <span
                              className={`text-[8px] font-bold ${
                                reply.isLiked ? 'text-[#FF2A55]' : 'text-slate-400'
                              }`}
                            >
                              {reply.likesCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Emoji Reaction Bar */}
        <div
          className={`flex items-center justify-between py-2 border-t px-1 ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}
        >
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleAppendEmoji(emoji)}
              className="text-lg hover:scale-125 active:scale-95 transition-transform p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Replying-To Active Indicator Banner */}
        {replyingTo && (
          <div
            className={`flex items-center justify-between px-3 py-1.5 mb-1.5 rounded-xl text-xs transition-all animate-in fade-in duration-150 ${
              isDark
                ? 'bg-[#7B52B9]/15 border border-[#7B52B9]/30 text-[#D4C4EB]'
                : 'bg-[#F2EDFA] border border-[#D4C4EB] text-[#7B52B9]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold truncate">
              <CornerDownRight size={13} className="shrink-0" />
              <span className="truncate">Replying to @{replyingTo.username}</span>
            </div>
            <button
              type="button"
              onClick={handleCancelReply}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-75 cursor-pointer transition-opacity"
              title="Cancel reply"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleAddComment}
          className={`flex items-center gap-2 pt-2 border-t ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}
        >
          <div
            className="w-7 h-7 rounded-full shrink-0 shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, #7B52B9 0%, #8456C5 50%, #5E3A89 100%)',
            }}
          />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Add a comment..."}
            className={`flex-1 h-9 px-3.5 rounded-full text-xs focus:outline-none border transition-colors ${
              isDark
                ? 'bg-black/30 border-white/10 text-white placeholder-slate-500 focus:border-[#7B52B9] focus:ring-1 focus:ring-[#7B52B9]'
                : 'bg-slate-100 border-black/5 text-[#12131D] placeholder-slate-400 focus:border-[#7B52B9] focus:ring-1 focus:ring-[#7B52B9]'
            }`}
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              commentText.trim()
                ? 'bg-black text-white hover:bg-neutral-800 shadow-md active:scale-90 cursor-pointer'
                : isDark
                ? 'bg-white/10 text-slate-500 cursor-not-allowed'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReelCommentsDrawer;
