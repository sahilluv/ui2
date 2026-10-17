export interface UserProfile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShadowIdentity {
  id: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ShadowRankType =
  | 'PAWN'
  | 'KNIGHT'
  | 'BISHOP'
  | 'ROOK'
  | 'QUEEN'
  | 'KING';

export interface ShadowRank {
  id: string;
  userId?: string;
  rankType: ShadowRankType;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShadowVerification {
  id: string;
  userId?: string;
  status: 'UNVERIFIED' | 'VERIFIED';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthUser extends User {
  profile?: UserProfile;
  shadow?: ShadowIdentity | null;
  shadowRank?: ShadowRank | null;
  verification?: ShadowVerification | null;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface IdentityResponse {
  id: string;
  email: string;
  name: string | null;
  profile?: UserProfile;
  shadow: ShadowIdentity | null;
  shadowRank: ShadowRank | null;
  verification: ShadowVerification | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface PostAuthor {
  id: string;
  name: string | null;
  shadowRank?: {
    rankType: ShadowRankType;
  } | null;
  verification?: {
    status: 'UNVERIFIED' | 'VERIFIED';
  } | null;
}

export interface Post {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface FeedResponse {
  items: Post[];
  nextCursor: string | null;
}
