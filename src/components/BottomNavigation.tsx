import React from 'react';
import { Search, MessageCircle, Bell } from 'lucide-react';
import { TabType } from './PhoneSimulator';

interface BottomNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  isDark: boolean;
  isShrunk?: boolean;
  unreadCount?: number;
  unreadNotificationsCount?: number;
  userAvatarGradient?: string;
}

interface TabItem {
  id: TabType;
  label: string;
  icon: (active: boolean, isShrunk: boolean) => React.ReactNode;
  badge?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  isDark,
  isShrunk = false,
  unreadCount = 2,
  unreadNotificationsCount = 2,
}) => {
  const tabs: TabItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (active, shrunk) => (
        <svg
          viewBox="0 0 24 24"
          className={`${shrunk ? 'w-4 h-4' : 'w-5 h-5'} fill-current transition-transform duration-300 ${
            active ? 'text-[#FF0A78]' : isDark ? 'text-[#C0C0C8]' : 'text-[#A3A5AD]'
          }`}
        >
          <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
      ),
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: (active, shrunk) => (
        <Search
          size={shrunk ? 17 : 21}
          strokeWidth={active ? 2.5 : 2}
          className={`transition-all duration-300 ${
            active ? 'text-[#FF0A78]' : isDark ? 'text-[#C0C0C8]' : 'text-[#A3A5AD]'
          }`}
        />
      ),
    },
    {
      id: 'reels',
      label: 'Reels',
      icon: (active, shrunk) => (
        <div
          className={`${
            shrunk ? 'w-8 h-8' : 'w-10 h-10'
          } rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300 border border-white/20 ${
            active
              ? 'scale-110 shadow-[0_4px_16px_rgba(255,10,120,0.5)]'
              : 'shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:scale-105'
          }`}
          style={{
            background: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 25%, #8A2BE2 50%, #FF8A00 75%, #FFB347 100%)',
          }}
        >
          <div className="w-5 h-5 rounded-[6px] border border-white flex items-center justify-center p-0.5">
            <div className="w-2 h-2 rounded-full border border-white" />
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      badge: unreadNotificationsCount,
      icon: (active, shrunk) => (
        <div className="relative flex items-center justify-center">
          <Bell
            size={shrunk ? 18 : 22}
            strokeWidth={active ? 2.5 : 2}
            className={`transition-all duration-300 ${
              active
                ? 'fill-current text-[#FF0A78]'
                : isDark
                ? 'text-[#C0C0C8]'
                : 'text-[#A3A5AD]'
            }`}
          />
        </div>
      ),
    },
    {
      id: 'chat',
      label: 'Chat',
      badge: unreadCount,
      icon: (active, shrunk) => (
        <div className="relative flex items-center justify-center">
          <MessageCircle
            size={shrunk ? 18 : 22}
            strokeWidth={active ? 2.5 : 2}
            className={`transition-all duration-300 ${
              active
                ? 'fill-current text-[#FF0A78]'
                : isDark
                ? 'text-[#C0C0C8]'
                : 'text-[#A3A5AD]'
            }`}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className={`absolute left-0 right-0 z-30 flex justify-center pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isShrunk ? 'bottom-2 px-5' : 'bottom-3 px-4'
      }`}
    >
      <nav
        className={`pointer-events-auto relative rounded-full flex items-center justify-between p-1.5 transition-all duration-300 select-none backdrop-blur-2xl ${
          isShrunk
            ? 'h-11 px-2 w-full max-w-[300px] shadow-lg'
            : 'h-14 px-2.5 w-full max-w-[350px] shadow-xl'
        } ${
          isDark
            ? 'bg-[#303036]/95 border border-[#38383D] shadow-[0_12px_36px_rgba(0,0,0,0.5)] text-[#F7F7F9]'
            : 'bg-[#FFFFFF]/95 border border-[#E5E7EB] shadow-[0_12px_36px_rgba(146,149,166,0.2)] text-[#202024]'
        }`}
      >
        {/* Top Rim Specular Glare */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-full"
        />

        {/* Tab Buttons */}
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          const isCenterTab = tab.id === 'reels';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 relative flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-[0.88] select-none ${
                isShrunk ? 'h-8 rounded-full' : 'h-11 rounded-[20px]'
              } ${
                isCenterTab
                  ? 'bg-transparent'
                  : isActive
                  ? 'text-[#FF0A78]'
                  : isDark
                  ? 'text-[#C0C0C8] hover:text-[#F7F7F9]'
                  : 'text-[#A3A5AD] hover:text-[#202024]'
              }`}
              title={tab.label}
              aria-label={tab.label}
              aria-selected={isActive}
            >
              {/* Icon Container */}
              <div
                className={`relative flex items-center justify-center transition-transform duration-200 ${
                  isActive ? 'scale-105' : 'group-hover:scale-105'
                }`}
              >
                {tab.icon(isActive, isShrunk)}

                {/* Badge (Reference-inspired bright pink badge with white text) */}
                {tab.badge && tab.badge > 0 && (
                  <span
                    className={`absolute ${
                      isShrunk
                        ? '-top-1 -right-1 min-w-3.5 h-3.5 px-0.5 text-[8px]'
                        : '-top-1 -right-2 min-w-4 h-4 px-1 text-[9px]'
                    } rounded-full bg-[#FF0A78] text-white font-black flex items-center justify-center shadow-md leading-none border border-white/40 transition-transform duration-300 ${
                      isActive ? 'scale-90' : 'animate-pulse'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Active Indicator Dot from Reference */}
              {isActive && !isCenterTab && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF0A78]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
