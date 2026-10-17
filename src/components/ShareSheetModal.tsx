import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  Check,
  Send,
  PlusCircle,
  Share2,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { PostItem } from '../data/mockData';

interface ShareSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostItem | null;
  isDark?: boolean;
  onShareToStory?: (post: PostItem) => void;
}

interface Contact {
  id: string;
  name: string;
  username: string;
  avatarGradient: string;
  online: boolean;
}

const RECENT_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Ezequias',
    username: 'ezequias.art',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
    online: true,
  },
  {
    id: 'c2',
    name: 'Elena Rostova',
    username: 'elena.art',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
    online: true,
  },
  {
    id: 'c3',
    name: 'Alice Cooper',
    username: 'alice_002',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
    online: false,
  },
  {
    id: 'c4',
    name: 'Carlos V.',
    username: 'carlos_v',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
    online: true,
  },
  {
    id: 'c5',
    name: 'Paulette',
    username: 'paulette_r',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
    online: false,
  },
  {
    id: 'c6',
    name: 'Marco Rossi',
    username: 'marco.visuals',
    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
    online: true,
  },
];

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  isOpen,
  onClose,
  post,
  isDark = true,
  onShareToStory,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPublishingStory, setIsPublishingStory] = useState(false);
  const [sentContacts, setSentContacts] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    const postUrl = `https://shadow.app/p/${post.id}`;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(postUrl);
      }
    } catch {
      // Fallback
    }
    setCopied(true);
    showToast('Link copied to clipboard! Ready to share.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToStory = () => {
    setIsPublishingStory(true);
    showToast('Post added to your 24-hour story! ✨');
    onShareToStory?.(post);
    setTimeout(() => {
      setIsPublishingStory(false);
      onClose();
    }, 1300);
  };

  const handleToggleSendContact = (contact: Contact) => {
    const isCurrentlySent = !!sentContacts[contact.id];
    setSentContacts((prev) => ({
      ...prev,
      [contact.id]: !isCurrentlySent,
    }));
    if (!isCurrentlySent) {
      showToast(`Direct message sent to @${contact.username}!`);
    } else {
      showToast(`Unsent to @${contact.username}`);
    }
  };

  const handleExternalShare = async (appName: string) => {
    const postUrl = `https://shadow.app/p/${post.id}`;
    const shareTitle = `${post.captionTitle || 'Shadow Post'} by @${post.author.username}`;

    if (appName === 'More' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out this artwork by @${post.author.username} on Shadow`,
          url: postUrl,
        });
        showToast('Shared successfully!');
        return;
      } catch {
        // Fallback below
      }
    }

    showToast(`Opening ${appName} with post link...`);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-full bg-[#121212]/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl border border-white/20 flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles size={14} className="text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backdrop click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Liquid Frosted Glass Bottom Sheet Container */}
      <div
        className={`relative w-full max-h-[90%] rounded-t-[32px] p-5 shadow-2xl flex flex-col z-10 transition-transform transform translate-y-0 duration-300 backdrop-blur-md overflow-hidden ${
          isDark
            ? 'bg-[#121212]/95 text-white border-t border-white/20 shadow-[0_-12px_40px_rgba(0,0,0,0.6)]'
            : 'bg-white/95 text-slate-900 border-t border-white/10 shadow-[0_-12px_36px_rgba(0,0,0,0.15)]'
        }`}
      >
        {/* Subtle Specular Top Rim Line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-full"
        />

        {/* Top Drag Indicator Handle */}
        <div className="w-10 h-1 rounded-full bg-slate-400/40 self-center mb-3 shrink-0" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between mb-3.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
              <Share2 size={15} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight">
                Share Post
              </h3>
              <p className="text-[10px] text-slate-400">
                Send to contacts or external apps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Post Preview Snippet */}
        <div
          className={`flex items-center gap-3 p-2.5 rounded-2xl mb-4 border transition-colors shrink-0 ${
            isDark
              ? 'bg-white/[0.04] border-white/10'
              : 'bg-slate-50 border-black/5'
          }`}
        >
          {/* Artwork Gradient Thumbnail */}
          <div
            className="w-11 h-11 rounded-xl shrink-0 shadow-md border border-white/10 overflow-hidden flex items-end p-1"
            style={{ background: post.gradient }}
          >
            <span className="text-[8px] font-black text-white/90 drop-shadow-sm truncate max-w-full">
              SHADOW
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full p-[1px]"
                style={{ background: post.author.avatarGradient }}
              >
                <div className={`w-full h-full rounded-full ${isDark ? 'bg-[#121422]' : 'bg-white'}`} />
              </div>
              <p className="text-xs font-bold truncate">@{post.author.username}</p>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              <span className="text-slate-200 font-semibold mr-1">{post.captionTitle}</span>
              {post.captionBody}
            </p>
          </div>
        </div>

        {/* Scrollable Actions Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          {/* Core Mock Social Share Options (Copy Link, Share to Story, Direct Message) */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Copy Link Option */}
            <button
              onClick={handleCopyLink}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all active:scale-95 group cursor-pointer border ${
                copied
                  ? 'bg-white/10 border-white/20 text-white'
                  : isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/5 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-black/5 text-slate-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform shadow-sm ${
                  copied
                    ? 'bg-white text-black scale-105'
                    : isDark
                    ? 'bg-white/10 text-white group-hover:scale-105'
                    : 'bg-white text-slate-800 group-hover:scale-105'
                }`}
              >
                {copied ? <Check size={18} /> : <LinkIcon size={18} />}
              </div>
              <span className="text-[10.5px] font-bold tracking-tight text-center">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            {/* 2. Share to Story Option */}
            <button
              onClick={handleShareToStory}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all active:scale-95 group cursor-pointer border ${
                isPublishingStory
                  ? 'bg-white/10 border-white/20 text-white'
                  : isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/5 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-black/5 text-slate-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                  isPublishingStory ? 'scale-105 ring-2 ring-white/40 ring-offset-2 ring-offset-black' : 'group-hover:scale-105'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
                }}
              >
                {isPublishingStory ? <Check size={18} /> : <PlusCircle size={20} />}
              </div>
              <span className="text-[10.5px] font-bold tracking-tight text-center">
                {isPublishingStory ? 'Added!' : 'Share to Story'}
              </span>
            </button>

            {/* 3. Direct Message Quick Pill */}
            <button
              onClick={() => {
                const firstContact = RECENT_CONTACTS[0];
                handleToggleSendContact(firstContact);
              }}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all active:scale-95 group cursor-pointer border ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/5 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-black/5 text-slate-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform shadow-sm group-hover:scale-105 ${
                  isDark ? 'bg-white/10 text-white' : 'bg-white text-slate-800'
                }`}
              >
                <Send size={18} className="ml-0.5" />
              </div>
              <span className="text-[10.5px] font-bold tracking-tight text-center">
                Direct Message
              </span>
            </button>
          </div>

          {/* External Apps Launcher (Horizontal branded mock targets) */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Share to External Apps
            </p>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {/* WhatsApp (classic green pill) */}
              <button
                onClick={() => handleExternalShare('WhatsApp')}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title="Share to WhatsApp"
              >
                <div className="w-11 h-11 rounded-2xl bg-neutral-800 border border-white/10 text-white flex items-center justify-center shadow-md shadow-black group-hover:scale-105 group-active:scale-95 transition-all">
                  <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.33 7.33 9 7.4 8.73 7.69C8.46 7.98 7.7 8.7 7.7 10.15C7.7 11.6 8.76 13 8.91 13.2C9.06 13.4 10.95 16.47 13.92 17.65C16.4 18.63 16.9 18.43 17.44 18.38C17.98 18.33 19.18 17.67 19.43 16.97C19.68 16.27 19.68 15.67 19.6 15.55C19.53 15.42 19.33 15.35 19.03 15.2C18.73 15.05 17.26 14.33 16.98 14.23C16.71 14.13 16.51 14.08 16.31 14.38C16.11 14.68 15.54 15.35 15.36 15.55C15.19 15.75 15.01 15.78 14.71 15.63C14.41 15.48 13.45 15.16 12.32 14.15C11.44 13.37 10.84 12.4 10.67 12.1C10.49 11.8 10.65 11.64 10.8 11.49C10.94 11.35 11.11 11.13 11.26 10.95C11.41 10.78 11.46 10.65 11.56 10.45C11.66 10.25 11.61 10.08 11.53 9.93C11.46 9.78 10.86 8.3 10.61 7.7C10.36 7.13 10.12 7.21 9.93 7.2C9.76 7.2 9.56 7.2 9.36 7.2L9.53 7.33Z" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[56px] text-center">
                  WhatsApp
                </span>
              </button>

              {/* X (Twitter) (noir minimal pill) */}
              <button
                onClick={() => handleExternalShare('X')}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title="Share to X"
              >
                <div className="w-11 h-11 rounded-2xl bg-black border border-white/25 text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-all">
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[56px] text-center">
                  X
                </span>
              </button>

              {/* Shadow (prismatic gradient pill) */}
              <button
                onClick={() => handleExternalShare('Shadow')}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title="Share to Shadow"
              >
                <div
                  className="w-11 h-11 rounded-2xl text-white flex items-center justify-center shadow-md shadow-black group-hover:scale-105 group-active:scale-95 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #2A2A2A 0%, #141414 100%)',
                  }}
                >
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[56px] text-center">
                  Shadow
                </span>
              </button>

              {/* Telegram (cyan pill) */}
              <button
                onClick={() => handleExternalShare('Telegram')}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title="Share to Telegram"
              >
                <div className="w-11 h-11 rounded-2xl bg-neutral-800 border border-white/10 text-white flex items-center justify-center shadow-md shadow-black group-hover:scale-105 group-active:scale-95 transition-all">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[56px] text-center">
                  Telegram
                </span>
              </button>

              {/* Messages (iOS SMS green pill) */}
              <button
                onClick={() => handleExternalShare('Messages')}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title="Share to Messages"
              >
                <div className="w-11 h-11 rounded-2xl bg-neutral-800 border border-white/10 text-white flex items-center justify-center shadow-md shadow-black group-hover:scale-105 group-active:scale-95 transition-all">
                  <MessageCircle size={20} className="fill-current" />
                </div>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[56px] text-center">
                  Messages
                </span>
              </button>

              {/* More / System Share (invokes native Web Share API with title and URL fallback) */}
              <button
                onClick={() => handleExternalShare('More')}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title="More Share Options"
              >
                <div className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center shadow-md group-hover:scale-105 group-active:scale-95 transition-all">
                  <Share2 size={18} className="text-white" />
                </div>
                <span className="text-[10px] text-slate-300 font-semibold truncate max-w-[56px] text-center">
                  More
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Contacts Carousel & Direct Messages */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Direct Message Contacts
              </p>
              <span className="text-[9.5px] text-slate-500 font-medium">
                {RECENT_CONTACTS.filter((c) => c.online).length} online
              </span>
            </div>

            <div className="space-y-1.5">
              {RECENT_CONTACTS.map((contact) => {
                const isSent = !!sentContacts[contact.id];
                return (
                  <div
                    key={contact.id}
                    className={`flex items-center justify-between p-2 rounded-2xl transition-colors ${
                      isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar with Online Indicator */}
                      <div className="relative shrink-0">
                        <div
                          className="w-9 h-9 rounded-full p-[1.5px] shadow-sm"
                          style={{ background: contact.avatarGradient }}
                        >
                          <div
                            className={`w-full h-full rounded-full ${
                              isDark ? 'bg-[#121422]' : 'bg-white'
                            }`}
                          />
                        </div>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#101222]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight truncate">
                          {contact.name}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight truncate">
                          @{contact.username}
                        </p>
                      </div>
                    </div>

                    {/* Toggleable Send / Sent Button */}
                    <button
                      onClick={() => handleToggleSendContact(contact)}
                      className={`px-3 py-1 rounded-full text-[10.5px] font-bold transition-all active:scale-95 cursor-pointer shrink-0 ${
                        isSent
                          ? 'bg-white text-black shadow-sm'
                          : isDark
                          ? 'bg-black hover:bg-neutral-900 border border-white/20 text-white shadow-xs'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      }`}
                    >
                      {isSent ? 'Sent ✓' : 'Send'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSheetModal;
