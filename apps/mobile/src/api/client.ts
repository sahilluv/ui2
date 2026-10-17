import {
  AuthResponse,
  CreatePostRequest,
  FeedResponse,
  IdentityResponse,
  LoginRequest,
  Post,
  RegisterRequest,
} from '../types/api';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<IdentityResponse> {
    return this.request<IdentityResponse>('/auth/me', {
      method: 'GET',
    });
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFeed(params: {
    limit?: number;
    cursor?: string;
  } = {}): Promise<FeedResponse> {
    const query = new URLSearchParams();
    if (params.limit !== undefined) {
      query.set('limit', String(params.limit));
    }
    if (params.cursor) {
      query.set('cursor', params.cursor);
    }

    const queryString = query.toString();
    return this.request<FeedResponse>(
      `/posts/feed${queryString ? `?${queryString}` : ''}`,
      { method: 'GET' },
    );
  }

  async getPost(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
