export type TabType = 'home' | 'explore' | 'reels' | 'shop' | 'profile' | 'create' | 'notifications';
export type ThemeMode = 'light' | 'dark';

export interface ReelItem {
  id: string;
  author: {
    name: string;
    username: string;
    location: string;
    avatarGradient: [string, string, ...string[]];
  };
  gradient: [string, string, ...string[]];
  likes: string;
  likesCount: number;
  comments: string;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  audioTrack?: string;
  caption?: string;
}

export interface CommentItem {
  id: string;
  reelId: string;
  author: {
    name: string;
    username: string;
    avatarGradient: [string, string, ...string[]];
  };
  text: string;
  timeAgo: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface StoryItem {
  id: string;
  username: string;
  avatarUrl?: string;
  gradientColors: [string, string, ...string[]];
  isCurrentUser?: boolean;
  hasUnseen?: boolean;
}

export interface PostItem {
  id: string;
  author: {
    name: string;
    username: string;
    avatarGradient: [string, string, ...string[]];
    location?: string;
  };
  timeAgo: string;
  imageGradient: [string, string, ...string[]];
  likesCount: number;
  commentsCount: number;
  likedByText: string;
  captionTitle: string;
  captionBody: string;
  totalPages?: number;
  currentPage?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ExploreCategory {
  id: string;
  title: string;
  iconName: string;
  gradient: [string, string, ...string[]];
}

export interface ExploreMediaCard {
  id: string;
  height: number;
  gradient: [string, string, ...string[]];
  aspectRatio?: number;
  title?: string;
  likes?: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  isAdd?: boolean;
  gradient: [string, string, ...string[]];
}

export interface NotificationItemData {
  id: string;
  user: {
    name: string;
    username: string;
    avatarGradient: [string, string, ...string[]];
  };
  actionType: 'like' | 'comment' | 'follow' | 'mention';
  content: string;
  timeAgo: string;
  postThumbnailGradient?: [string, string, ...string[]];
  isRead: boolean;
}
