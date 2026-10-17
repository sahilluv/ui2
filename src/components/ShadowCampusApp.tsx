import React, { useState } from 'react';
import {
  Home,
  Compass,
  PlusSquare,
  Bell,
  User,
  Heart,
  MessageCircle,
  Share2,
  Search,
  ArrowRight,
  LogOut,
  Sparkles,
  Shield,
  Award,
  CheckCircle2,
  ChevronRight,
  Send,
  MoreVertical,
  X,
} from 'lucide-react';

export type CampusTab = 'Home' | 'Discover' | 'Create' | 'Notifications' | 'Profile';

export interface FeedPost {
  id: string;
  authorName: string;
  authorInitials: string;
  avatarColor: string;
  context: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    authorName: 'Aarav Sharma',
    authorInitials: 'AS',
    avatarColor: '#F5B7A4',
    context: 'Shadow community',
    content: 'Quiet floor at the central library is finally open for finals week. Plenty of charging ports on the 3rd floor west wing!',
    createdAt: '8 min ago',
    likes: 14,
    comments: 3,
    isLiked: false,
  },
  {
    id: 'post_2',
    authorName: 'Priya Nambiar',
    authorInitials: 'PN',
    avatarColor: '#A8C6B5',
    context: 'Campus Creatives',
    content: 'Looking for 2 UI designers to collaborate on the annual inter-college hackathon project. Ping me if you love clean interfaces & Tailwind.',
    createdAt: '32 min ago',
    likes: 27,
    comments: 8,
    isLiked: true,
  },
  {
    id: 'post_3',
    authorName: 'Rohan Deshmukh',
    authorInitials: 'RD',
    avatarColor: '#AFC4E3',
    context: 'First-Year Founders',
    content: 'Just deployed our demo on AI Studio. Zero cold start and instant preview. Huge shoutout to the lab mentors for the architecture tips.',
    createdAt: '2 hrs ago',
    likes: 42,
    comments: 11,
    isLiked: false,
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    initials: 'AK',
    avatarColor: '#A8C6B5',
    name: 'Aisha Khan',
    action: 'liked your post',
    detail: 'Small win: our studio project made it through critique.',
    time: '8 min ago',
    kind: 'LIKE',
    unread: true,
  },
  {
    id: '2',
    initials: 'LC',
    avatarColor: '#AFC4E3',
    name: 'Leo Chen',
    action: 'commented on your post',
    detail: 'The quiet floor is finally open again.',
    time: '24 min ago',
    kind: 'COMMENT',
    unread: true,
  },
  {
    id: '3',
    initials: 'EP',
    avatarColor: '#D8B6D8',
    name: 'Elena Park',
    action: 'wants to connect',
    detail: 'Visual Arts • Northbridge University',
    time: '1 hr ago',
    kind: 'CONNECTION',
    unread: true,
  },
  {
    id: '4',
    initials: 'LN',
    avatarColor: '#1B2A41',
    name: 'Late Night Library',
    action: 'shared a new update',
    detail: 'Quiet study rooms are open until midnight this week.',
    time: '3 hrs ago',
    kind: 'COMMUNITY',
    unread: false,
  },
  {
    id: '5',
    initials: 'SR',
    avatarColor: '#F5B7A4',
    name: 'Sofia Reyes',
    action: 'liked your comment',
    detail: 'Film Club • Eastfield University',
    time: 'Yesterday',
    kind: 'LIKE',
    unread: false,
  },
];

const TOPICS = [
  { id: '1', title: 'Study spots', detail: '248 conversations', color: '#DDE9E2', textColor: '#264A38' },
  { id: '2', title: 'Campus events', detail: '192 conversations', color: '#F8DDD3', textColor: '#7A3528' },
  { id: '3', title: 'Internships', detail: '156 conversations', color: '#DCE5F3', textColor: '#25446E' },
];

const CATEGORIES = [
  'All interests',
  'Design',
  'Technology',
  'Music',
  'Wellness',
  'Entrepreneurship',
];

const STUDENTS = [
  { id: '1', initials: 'NB', name: 'Nia Brooks', course: 'Architecture', color: '#D6B5A9' },
  { id: '2', initials: 'OM', name: 'Owen Malik', course: 'Economics', color: '#A8C6B5' },
  { id: '3', initials: 'EP', name: 'Elena Park', course: 'Visual Arts', color: '#AFC4E3' },
  { id: '4', initials: 'TW', name: 'Theo Williams', course: 'Mechanical Engineering', color: '#D8B6D8' },
];

const COMMUNITIES = [
  { id: '1', name: 'Late Night Library', detail: 'Study community', members: '1.2k members', color: '#1B2A41' },
  { id: '2', name: 'First-Year Founders', detail: 'Student community', members: '684 members', color: '#E26D5A' },
  { id: '3', name: 'Campus Creatives', detail: 'College-wide group', members: '426 members', color: '#6D8C7C' },
];

export const ShadowCampusApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('arjun@goa.edu');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [registerName, setRegisterName] = useState('');
  const [currentTab, setCurrentTab] = useState<CampusTab>('Home');
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_POSTS);

  // Create Screen State
  const [postText, setPostText] = useState('');
  const [selectedPostType, setSelectedPostType] = useState('Campus life');
  const [selectedVisibility, setSelectedVisibility] = useState('Campus');
  const [activeInterestCategory, setActiveInterestCategory] = useState('All interests');
  const [searchQuery, setSearchQuery] = useState('');
  const [profileAction, setProfileAction] = useState<'edit' | 'share'>('edit');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleLike = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newIsLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newIsLiked,
            likes: newIsLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handlePublishPost = () => {
    const text = postText.trim();
    if (!text) {
      showToast('Write something before posting!');
      return;
    }

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      authorName: 'Arjun Mehta',
      authorInitials: 'AM',
      avatarColor: '#D6C2E8',
      context: `${selectedVisibility} • ${selectedPostType}`,
      content: text,
      createdAt: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false,
    };

    setFeedPosts([newPost, ...feedPosts]);
    setPostText('');
    setCurrentTab('Home');
    showToast('Post published to campus feed!');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in email and password');
      return;
    }
    setIsAuthenticated(true);
    showToast('Welcome back to Shadow!');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in required fields');
      return;
    }
    setIsAuthenticated(true);
    showToast('Account created successfully!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showToast('Logged out from Shadow');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-full flex justify-center py-6 px-2 sm:px-4">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 z-50 px-4 py-2 bg-[#1B2A41] text-white text-xs font-semibold rounded-full shadow-xl border border-white/20 animate-fade-in flex items-center gap-2">
          <Sparkles size={14} className="text-[#E26D5A]" />
          {toastMessage}
        </div>
      )}

      {/* Phone Mockup Frame */}
      <div className="w-full max-w-[420px] min-h-[760px] h-[820px] bg-[#141522] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[6px] border-[#2A2B3D] flex flex-col relative overflow-hidden">
        {/* Hardware Notch / Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-[#0A0B10] rounded-full z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1C1D2A] mr-3" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#10111A]" />
        </div>

        {/* Screen Bezel */}
        <div className="flex-1 bg-[#F7F8F6] rounded-[38px] overflow-hidden flex flex-col relative text-[#1B2A41]">
          {/* Top Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-[#1B2A41] shrink-0 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-[#1B2A41] rounded-[3px] p-0.5 flex items-center">
                <div className="w-full h-full bg-[#1B2A41] rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* If NOT Authenticated: Render Login/Register Flow from apps/mobile */}
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col justify-center px-6 py-8 overflow-y-auto no-scrollbar">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#1B2A41] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg">
                  S
                </div>
                <h1 className="text-2xl font-extrabold text-[#1B2A41] tracking-wider">
                  SHADOW
                </h1>
                <p className="text-xs text-[#728096] mt-1">
                  Your campus, in motion.
                </p>
              </div>

              <div className="bg-white border border-[#E2E7EC] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-around border-b border-[#EEF1F3] pb-3 mb-5">
                  <button
                    onClick={() => setAuthView('login')}
                    className={`text-xs font-bold pb-1 transition-all ${
                      authView === 'login'
                        ? 'text-[#1B2A41] border-b-2 border-[#1B2A41]'
                        : 'text-[#8792A3]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthView('register')}
                    className={`text-xs font-bold pb-1 transition-all ${
                      authView === 'register'
                        ? 'text-[#1B2A41] border-b-2 border-[#1B2A41]'
                        : 'text-[#8792A3]'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={authView === 'login' ? handleLogin : handleRegister}>
                  {authView === 'register' && (
                    <div className="mb-3">
                      <label className="block text-[11px] font-bold text-[#1B2A41] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="e.g. Arjun Mehta"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#DDE3E8] bg-[#F7F8F6] text-[#334155] focus:outline-none focus:border-[#1B2A41]"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="block text-[11px] font-bold text-[#1B2A41] mb-1">
                      Campus Email
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#DDE3E8] bg-[#F7F8F6] text-[#334155] focus:outline-none focus:border-[#1B2A41]"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-[#1B2A41] mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#DDE3E8] bg-[#F7F8F6] text-[#334155] focus:outline-none focus:border-[#1B2A41]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1B2A41] hover:bg-[#253A5A] text-white text-xs font-bold transition-all shadow-md"
                  >
                    {authView === 'login' ? 'Login to Shadow' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-[10px] text-[#8792A3]">
                    Connected to NestJS Prisma API (<span className="font-mono text-[#537365]">/api/v1/auth</span>)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated App Body with 5 Tabs */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* SCREEN CONTENT AREA */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
                {/* TAB 1: HOME SCREEN */}
                {currentTab === 'Home' && (
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pt-1 pb-2">
                      <div>
                        <h1 className="text-xl font-extrabold tracking-wider text-[#1B2A41]">
                          SHADOW
                        </h1>
                        <p className="text-[11px] text-[#728096] -mt-0.5">
                          Your campus, in motion.
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentTab('Notifications')}
                        className="relative w-10 h-10 rounded-full bg-white border border-[#E2E7EC] flex items-center justify-center text-[#1B2A41] shadow-sm hover:bg-slate-50"
                        title="Notifications"
                      >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E26D5A] border-2 border-white" />
                        )}
                      </button>
                    </div>

                    {/* Composer Card Prompt */}
                    <div
                      onClick={() => setCurrentTab('Create')}
                      className="bg-white border border-[#E2E7EC] rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer shadow-sm hover:border-[#1B2A41]/30 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1B2A41] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                        AM
                      </div>
                      <div className="flex-1 text-xs text-[#8792A3]">
                        What's happening on campus?
                      </div>
                      <div className="w-1.5 h-6 rounded-full bg-[#E26D5A]" />
                    </div>

                    {/* Feed Header */}
                    <div className="flex items-baseline justify-between pt-1">
                      <h2 className="text-base font-bold text-[#1B2A41]">Your feed</h2>
                      <span className="text-[11px] text-[#8792A3]">Fresh from campus</span>
                    </div>

                    {/* Post Cards */}
                    <div className="space-y-3">
                      {feedPosts.map((post) => (
                        <div
                          key={post.id}
                          className="bg-white border border-[#E2E7EC] rounded-2xl p-4 shadow-sm"
                        >
                          {/* Post Header */}
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                              style={{ backgroundColor: post.avatarColor }}
                            >
                              {post.authorInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-bold text-[#1B2A41] truncate">
                                {post.authorName}
                              </h3>
                              <p className="text-[10px] text-[#8792A3] truncate">
                                {post.context}
                              </p>
                            </div>
                            <span className="text-[10px] text-[#A2AAB5] shrink-0">
                              {post.createdAt}
                            </span>
                          </div>

                          {/* Post Content */}
                          <p className="text-xs text-[#334155] leading-relaxed mb-3 whitespace-pre-line">
                            {post.content}
                          </p>

                          {/* Post Actions */}
                          <div className="flex items-center justify-between border-t border-[#EEF1F3] pt-2.5 text-xs text-[#6F7C8E]">
                            <button
                              onClick={() => handleToggleLike(post.id)}
                              className={`flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition-all ${
                                post.isLiked ? 'text-[#E26D5A] font-bold' : ''
                              }`}
                            >
                              <Heart
                                size={15}
                                className={post.isLiked ? 'fill-[#E26D5A] text-[#E26D5A]' : ''}
                              />
                              <span>{post.likes}</span>
                            </button>

                            <button
                              onClick={() => showToast('Comments drawer coming in next release')}
                              className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition-all"
                            >
                              <MessageCircle size={15} />
                              <span>{post.comments}</span>
                            </button>

                            <button
                              onClick={() => showToast('Post link copied to clipboard!')}
                              className="text-[11px] font-bold text-[#E26D5A] hover:underline"
                            >
                              Share
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: DISCOVER SCREEN */}
                {currentTab === 'Discover' && (
                  <div className="p-4 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <h1 className="text-xl font-extrabold tracking-wider text-[#1B2A41]">
                          SHADOW
                        </h1>
                        <p className="text-[11px] text-[#728096] -mt-0.5">
                          Find your people.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#EAF0EC] text-[#537365] text-[9px] font-extrabold tracking-wider uppercase">
                        DISCOVER
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-[#1B2A41]">
                        Explore campus life
                      </h2>
                      <p className="text-xs text-[#728096] mt-0.5">
                        Find conversations, communities, and students who make campus feel closer.
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white border border-[#E2E7EC] rounded-xl px-3.5 py-2.5 flex items-center gap-2 shadow-sm">
                      <Search size={15} className="text-[#8792A3]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search people, topics, or colleges"
                        className="w-full text-xs text-[#334155] bg-transparent focus:outline-none placeholder:text-[#8792A3]"
                      />
                    </div>

                    {/* Trending Topics */}
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="text-sm font-bold text-[#1B2A41]">Trending now</h3>
                        <span className="text-[11px] text-[#E26D5A] font-bold cursor-pointer">
                          See all
                        </span>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                        {TOPICS.map((topic) => (
                          <div
                            key={topic.id}
                            style={{ backgroundColor: topic.color }}
                            className="w-36 h-28 rounded-2xl p-3 shrink-0 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                          >
                            <h4
                              className="text-xs font-bold leading-tight"
                              style={{ color: topic.textColor }}
                            >
                              {topic.title}
                            </h4>
                            <div className="flex items-end justify-between">
                              <span
                                className="text-[10px]"
                                style={{ color: topic.textColor, opacity: 0.8 }}
                              >
                                {topic.detail}
                              </span>
                              <ArrowRight size={13} style={{ color: topic.textColor }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Browse Interests Chips */}
                    <div>
                      <h3 className="text-sm font-bold text-[#1B2A41] mb-2">
                        Browse interests
                      </h3>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveInterestCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                              activeInterestCategory === cat
                                ? 'bg-[#1B2A41] text-white'
                                : 'bg-white border border-[#DDE3E8] text-[#607082]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Students to meet */}
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="text-sm font-bold text-[#1B2A41]">Students to meet</h3>
                        <span className="text-[11px] text-[#E26D5A] font-bold cursor-pointer">
                          See all
                        </span>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                        {STUDENTS.map((student) => (
                          <div
                            key={student.id}
                            className="w-32 bg-white border border-[#E2E7EC] rounded-2xl p-3 shrink-0 flex flex-col items-center text-center shadow-sm"
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-extrabold mb-2"
                              style={{ backgroundColor: student.color }}
                            >
                              {student.initials}
                            </div>
                            <span className="text-xs font-bold text-[#1B2A41] truncate w-full">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-[#8792A3] truncate w-full mt-0.5">
                              {student.course}
                            </span>
                            <button
                              onClick={() => showToast(`Connected with ${student.name}`)}
                              className="mt-2.5 px-2.5 py-1 rounded-lg border border-[#E2E7EC] text-[10px] font-bold text-[#537365] hover:bg-[#EAF0EC] transition-all"
                            >
                              View profile
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Communities */}
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="text-sm font-bold text-[#1B2A41]">Communities</h3>
                        <span className="text-[11px] text-[#E26D5A] font-bold cursor-pointer">
                          See all
                        </span>
                      </div>
                      <div className="space-y-2">
                        {COMMUNITIES.map((com) => (
                          <div
                            key={com.id}
                            className="bg-white border border-[#E2E7EC] rounded-2xl p-3 flex items-center gap-3 shadow-sm hover:border-[#1B2A41]/30 transition-all cursor-pointer"
                          >
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
                              style={{ backgroundColor: com.color }}
                            >
                              {com.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#1B2A41] truncate">
                                {com.name}
                              </h4>
                              <p className="text-[10px] text-[#607082]">{com.detail}</p>
                              <span className="text-[9px] text-[#A2AAB5]">{com.members}</span>
                            </div>
                            <ChevronRight size={16} className="text-[#E26D5A]" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested card */}
                    <div className="bg-white border border-[#E2E7EC] rounded-2xl p-4 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#E26D5A]" />
                      <h4 className="text-xs font-bold text-[#1B2A41] mt-1">The 8am Club</h4>
                      <p className="text-[11px] text-[#607082] mt-1 leading-relaxed">
                        A low-key corner for early birds, quiet mornings, and surviving the first lecture.
                      </p>
                      <span className="block mt-2 text-[10px] font-bold text-[#537365]">
                        92 students are talking here
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 3: CREATE SCREEN */}
                {currentTab === 'Create' && (
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setCurrentTab('Home')}
                        className="text-xs font-semibold text-[#728096] hover:text-[#1B2A41]"
                      >
                        Cancel
                      </button>
                      <h2 className="text-sm font-bold text-[#1B2A41]">Create post</h2>
                      <button
                        onClick={handlePublishPost}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1B2A41] hover:bg-[#253A5A] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        Post
                      </button>
                    </div>

                    {/* Author Row */}
                    <div className="flex items-center gap-3 border-b border-[#E2E7EC] pb-3 pt-1">
                      <div className="w-11 h-11 rounded-full bg-[#1B2A41] text-white flex items-center justify-center font-extrabold text-xs">
                        AM
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#1B2A41]">Arjun Mehta</h3>
                        <p className="text-[10px] text-[#8792A3]">Shadow community</p>
                      </div>
                    </div>

                    {/* Composer Card */}
                    <div className="bg-white border border-[#E2E7EC] rounded-2xl p-3.5 shadow-sm">
                      <textarea
                        rows={5}
                        maxLength={280}
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Share something with your campus..."
                        className="w-full text-xs text-[#334155] placeholder:text-[#9AA4B2] resize-none focus:outline-none"
                      />
                      <div className="flex items-center justify-between border-t border-[#EEF1F3] pt-2 mt-2">
                        <span className="text-[10px] text-[#9AA4B2]">
                          Keep it thoughtful and campus-friendly.
                        </span>
                        <span className="text-[11px] font-semibold text-[#728096]">
                          {postText.length}/280
                        </span>
                      </div>
                    </div>

                    {/* Post Type Chips */}
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A41] mb-2">
                        Post type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Campus life', 'Question', 'Event', 'Opportunity'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedPostType(type)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              selectedPostType === type
                                ? 'bg-[#EAF0EC] border border-[#6D8C7C] text-[#537365]'
                                : 'bg-white border border-[#DDE3E8] text-[#607082]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Share with card */}
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A41] mb-2">
                        Share with
                      </label>
                      <div className="bg-white border border-[#E2E7EC] rounded-2xl p-3 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#DCE5F3] text-[#1B2A41] font-extrabold flex items-center justify-center text-sm">
                            N
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#1B2A41]">
                              Northbridge University
                            </h4>
                            <p className="text-[10px] text-[#8792A3]">College community</p>
                          </div>
                        </div>
                        <ArrowRight size={15} className="text-[#E26D5A]" />
                      </div>
                    </div>

                    {/* Visibility Options */}
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A41] mb-2">
                        Visibility
                      </label>
                      <div className="bg-white border border-[#E2E7EC] rounded-2xl p-2 flex items-center justify-around shadow-sm">
                        {['Campus', 'Community', 'Only me'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedVisibility(opt)}
                            className="flex items-center gap-1.5 py-1.5 px-2"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                selectedVisibility === opt
                                  ? 'border-[#E26D5A]'
                                  : 'border-[#B5BEC9]'
                              }`}
                            >
                              {selectedVisibility === opt && (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E26D5A]" />
                              )}
                            </div>
                            <span
                              className={`text-[11px] ${
                                selectedVisibility === opt
                                  ? 'font-bold text-[#1B2A41]'
                                  : 'text-[#8792A3]'
                              }`}
                            >
                              {opt}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Note Card */}
                    <div className="bg-[#EAF0EC] rounded-2xl p-3.5 text-[#537365]">
                      <h5 className="text-xs font-bold">Make it yours</h5>
                      <p className="text-[11px] mt-1 text-[#607A6D] leading-relaxed">
                        Posts help your campus find the ideas, events, and people that matter.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 4: NOTIFICATIONS SCREEN */}
                {currentTab === 'Notifications' && (
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <h1 className="text-xl font-extrabold tracking-wider text-[#1B2A41]">
                          SHADOW
                        </h1>
                        <p className="text-[11px] text-[#728096] -mt-0.5">
                          Stay in the loop.
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#EAF0EC] text-[#537365] text-[9px] font-extrabold tracking-wider uppercase">
                        ACTIVITY
                      </span>
                    </div>

                    {/* Title with Unread Count */}
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-[#1B2A41]">Notifications</h2>
                        <p className="text-xs text-[#728096]">
                          The latest from your campus circle.
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#F8DDD3] flex flex-col items-center justify-center text-[#B94F3E]">
                        <span className="text-base font-extrabold leading-none">
                          {unreadCount}
                        </span>
                        <span className="text-[9px] font-bold">new</span>
                      </div>
                    </div>

                    {/* Summary banner */}
                    <div className="bg-white border border-[#E2E7EC] rounded-2xl p-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF0EC] flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#6D8C7C]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1B2A41]">
                            You have {unreadCount} new updates
                          </h4>
                          <p className="text-[10px] text-[#8792A3]">
                            Unread activity waiting for review
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                          showToast('All notifications marked as read');
                        }}
                        className="text-[10px] font-bold text-[#E26D5A] hover:underline"
                      >
                        Mark read
                      </button>
                    </div>

                    {/* Recent Activity List */}
                    <div className="space-y-2.5 pt-1">
                      <h3 className="text-xs font-bold text-[#1B2A41]">Recent activity</h3>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
                            );
                          }}
                          className={`rounded-2xl p-3 flex items-start gap-3 border transition-all cursor-pointer ${
                            notif.unread
                              ? 'bg-[#FFFCFA] border-[#F0D9D1]'
                              : 'bg-white border-[#E2E7EC]'
                          }`}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                            style={{ backgroundColor: notif.avatarColor }}
                          >
                            {notif.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#607082] leading-snug">
                              <strong className="text-[#1B2A41]">{notif.name}</strong>{' '}
                              {notif.action}
                            </p>
                            <p className="text-[11px] text-[#8792A3] mt-0.5 truncate">
                              {notif.detail}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] text-[#A2AAB5]">{notif.time}</span>
                              <span className="text-[8px] font-extrabold tracking-wider text-[#6D8C7C] bg-[#EAF0EC] px-1.5 py-0.5 rounded">
                                {notif.kind}
                              </span>
                            </div>
                          </div>
                          {notif.unread && (
                            <div className="w-2 h-2 rounded-full bg-[#E26D5A] mt-1 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 5: PROFILE SCREEN */}
                {currentTab === 'Profile' && (
                  <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pt-1">
                      <h1 className="text-xl font-extrabold text-[#1B2A41]">Profile</h1>
                      <button
                        onClick={handleLogout}
                        className="w-9 h-9 rounded-full bg-white border border-[#E2E7EC] flex items-center justify-center text-[#C54F40] shadow-sm hover:bg-red-50"
                        title="Logout"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white border border-[#E2E7EC] rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 rounded-full bg-[#D6C2E8] text-white flex items-center justify-center text-xl font-extrabold shrink-0 shadow-inner">
                          AM
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-extrabold text-[#1B2A41]">Arjun Mehta</h2>
                          <p className="text-xs text-[#5E6C7B]">Goa University</p>
                          <p className="text-[11px] text-[#6D7B8D]">Data Science • 3rd Year</p>
                          <p className="text-[10px] text-[#6D7B8D] font-mono mt-0.5">
                            arjun@goa.edu
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-[#334155] leading-relaxed mt-3.5">
                        Building ideas, learning every day.
                      </p>
                      <p className="text-[11px] text-[#5D6877] mt-1">📍 Panaji, Goa</p>

                      {/* Shadow Identity Section */}
                      <div className="mt-3.5 pt-3 border-t border-[#EEF1F3] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A41]">
                          <Shield size={13} className="text-[#537365]" />
                          <span>Shadow Identity</span>
                        </div>
                        <div className="text-[11px] text-[#68778B] flex items-center justify-between">
                          <span>Shadow ID:</span>
                          <span className="font-mono font-semibold text-[#1B2A41]">
                            sh_94f28a
                          </span>
                        </div>
                        <div className="text-[11px] text-[#68778B] flex items-center justify-between">
                          <span>Rank:</span>
                          <span className="font-bold text-[#537365] bg-[#EAF0EC] px-2 py-0.5 rounded text-[9px]">
                            PAWN
                          </span>
                        </div>
                        <div className="text-[11px] text-[#68778B] flex items-center justify-between">
                          <span>Verification:</span>
                          <span className="text-[10px] text-[#E26D5A] font-semibold">
                            UNVERIFIED
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2.5 mt-4">
                        <button
                          onClick={() => {
                            setProfileAction('edit');
                            showToast('Edit profile details saved');
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            profileAction === 'edit'
                              ? 'bg-[#1B2A41] text-white border-[#1B2A41]'
                              : 'bg-[#EEF2F7] text-[#1B2A41] border-[#DDE5EE]'
                          }`}
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            setProfileAction('share');
                            showToast('Profile link copied to clipboard');
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            profileAction === 'share'
                              ? 'bg-[#1B2A41] text-white border-[#1B2A41]'
                              : 'bg-white text-[#334155] border-[#DDE5EE]'
                          }`}
                        >
                          Share Profile
                        </button>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white border border-[#E2E7EC] rounded-2xl p-3.5 flex items-center justify-around shadow-sm text-center">
                      <div>
                        <div className="text-base font-extrabold text-[#1B2A41]">12</div>
                        <div className="text-[10px] text-[#7A8799]">Posts</div>
                      </div>
                      <div className="w-[1px] h-7 bg-[#EEF1F4]" />
                      <div>
                        <div className="text-base font-extrabold text-[#1B2A41]">248</div>
                        <div className="text-[10px] text-[#7A8799]">Followers</div>
                      </div>
                      <div className="w-[1px] h-7 bg-[#EEF1F4]" />
                      <div>
                        <div className="text-base font-extrabold text-[#1B2A41]">186</div>
                        <div className="text-[10px] text-[#7A8799]">Following</div>
                      </div>
                    </div>

                    {/* Recent Posts */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#1B2A41]">Recent posts</h3>
                        <span className="text-[11px] font-bold text-[#E26D5A] cursor-pointer">
                          View all posts
                        </span>
                      </div>

                      {[
                        {
                          id: 'p1',
                          title: 'Campus meetup recap',
                          snippet:
                            'Our study group locked in the final concept board and wrapped up the presentation with a cleaner timeline.',
                          time: '2h ago',
                          likes: 38,
                          comments: 11,
                        },
                        {
                          id: 'p2',
                          title: 'Data sprint update',
                          snippet:
                            'Spent the evening validating the dashboard flow and narrowing down the strongest user stories for the next demo.',
                          time: 'Yesterday',
                          likes: 52,
                          comments: 16,
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-[#E2E7EC] rounded-2xl p-3.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-[#1B2A41]">
                            <span>{item.title}</span>
                            <span className="text-[10px] font-normal text-[#8B97A5]">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#475467] mt-1.5 leading-relaxed">
                            {item.snippet}
                          </p>
                          <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-[#EEF1F3] text-[11px] text-[#68778B]">
                            <span>♡ {item.likes}</span>
                            <span>○ {item.comments}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM NAVIGATION BAR (Matching apps/mobile RootNavigator) */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E2E7EC] px-4 flex items-center justify-around z-20">
                {[
                  { id: 'Home', label: 'Home', icon: Home },
                  { id: 'Discover', label: 'Discover', icon: Compass },
                  { id: 'Create', label: 'Create', icon: PlusSquare },
                  { id: 'Notifications', label: 'Activity', icon: Bell, badge: unreadCount > 0 },
                  { id: 'Profile', label: 'Profile', icon: User },
                ].map((item) => {
                  const isActive = currentTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id as CampusTab)}
                      className={`relative flex flex-col items-center justify-center py-1 transition-all ${
                        isActive ? 'text-[#1B2A41]' : 'text-[#8792A3] hover:text-[#1B2A41]'
                      }`}
                    >
                      <div className="relative">
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                        {item.badge && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E26D5A] border-2 border-white" />
                        )}
                      </div>
                      <span
                        className={`text-[9px] mt-0.5 ${
                          isActive ? 'font-bold' : 'font-medium'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
