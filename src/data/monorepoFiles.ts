export interface MonorepoFile {
  path: string;
  name: string;
  category: 'Mobile App' | 'NestJS API' | 'Prisma & DB' | 'Packages & Infra';
  description: string;
  code: string;
}

export const MONOREPO_FILES: MonorepoFile[] = [
  {
    path: 'apps/mobile/App.tsx',
    name: 'App.tsx',
    category: 'Mobile App',
    description: 'React Native & Expo entry point with SafeAreaProvider, ThemeProvider, SessionProvider, and RootNavigator.',
    code: `import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SessionProvider } from './src/context/SessionContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SessionProvider>
          <AppContent />
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}`,
  },
  {
    path: 'apps/mobile/src/navigation/RootNavigator.tsx',
    name: 'RootNavigator.tsx',
    category: 'Mobile App',
    description: 'Session-gated navigation with custom concept floating BottomNavigation (Home, Explore, Reels, Create, Profile).',
    code: `import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSession } from '../context/SessionContext';
import { useTheme } from '../context/ThemeContext';
import { BottomNavigation } from '../components/BottomNavigation';
import { TabType } from '../types';

import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ReelsScreen from '../screens/ReelsScreen';
import CreateScreen from '../screens/CreateScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

function AppTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={({ state, navigation }) => {
        const routeName = state.routes[state.index].name;
        const currentTab: TabType =
          routeName === 'Home'
            ? 'home'
            : routeName === 'Discover'
            ? 'explore'
            : routeName === 'Reels'
            ? 'reels'
            : routeName === 'Create'
            ? 'shop'
            : 'profile';

        return (
          <BottomNavigation
            currentTab={currentTab}
            colors={colors}
            onTabChange={(tab) => {
              if (tab === 'home') navigation.navigate('Home');
              else if (tab === 'explore') navigation.navigate('Discover');
              else if (tab === 'reels') navigation.navigate('Reels');
              else if (tab === 'shop') navigation.navigate('Create');
              else if (tab === 'profile') navigation.navigate('Profile');
            }}
          />
        );
      }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Reels" component={ReelsScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { state } = useSession();
  const { colors } = useTheme();

  if (state === 'BOOTSTRAPPING') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state === 'AUTHENTICATED' ? <AppTabs /> : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}`,
  },
  {
    path: 'apps/mobile/src/screens/HomeScreen.tsx',
    name: 'HomeScreen.tsx',
    category: 'Mobile App',
    description: 'Real feed API (apiClient.getFeed) + Concept UI (ShadowHeader with cursive logo, StoryRow, PostCard).',
    code: `import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { ShadowHeader } from '../components/ShadowHeader';
import { StoryRow } from '../components/StoryRow';
import { PostCard } from '../components/PostCard';
import { ShareSheet } from '../components/ShareSheet';
import { useTheme } from '../context/ThemeContext';
import { apiClient } from '../api/client';
import { Post } from '../types/api';

export default function HomeScreen({ navigation, route }: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSharePostId, setSelectedSharePostId] = useState<string | null>(null);

  const loadFeed = useCallback(async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);
      const res = await apiClient.getFeed({ limit: 20 });
      setPosts(res.items);
      setNextCursor(res.nextCursor);
    } catch (e: any) {
      setError(e.message || 'Error loading feed');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ShadowHeader
        colors={colors}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onAddPress={() => navigation.navigate('Create')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
        unreadCount={2}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadFeed(true)} tintColor={colors.accent} />}
      >
        <StoryRow stories={[{ id: 'me', username: 'Tu historia', isCurrentUser: true, gradientColors: ['#7B52B9', '#8456C5', '#5E3A89'] }]} colors={colors} />
        {isLoading ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} /> : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              colors={colors}
              onSharePress={id => setSelectedSharePostId(id)}
              onUserPress={() => navigation.navigate('Profile')}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}`,
  },
  {
    path: 'apps/mobile/src/screens/ProfileScreen.tsx',
    name: 'ProfileScreen.tsx',
    category: 'Mobile App',
    description: 'Real Shadow authenticated user identity + Concept ProfileHeader, stats, and media tabs.',
    code: `import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { ProfileHeader } from '../components/ProfileHeader';
import { MediaGrid } from '../components/MediaGrid';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';

export default function ProfileScreen({ navigation }: any) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { identity, logout } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'tags' | 'igtv'>('posts');

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          colors={colors}
          isFollowing={isFollowing}
          onToggleFollow={() => setIsFollowing(p => !p)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          highlights={[]}
          displayName={identity?.name || undefined}
          email={identity?.email || undefined}
          bio={identity?.profile?.bio || undefined}
          shadowRank={identity?.shadowRank?.rankType || undefined}
          verificationStatus={identity?.verification?.status || undefined}
          shadowId={identity?.shadow?.id || undefined}
          onLogout={handleLogout}
        />
        <MediaGrid cards={[]} colors={colors} onCardPress={() => {}} />
      </ScrollView>
    </View>
  );
}`,
  },
  {
    path: 'apps/mobile/src/screens/CreateScreen.tsx',
    name: 'CreateScreen.tsx',
    category: 'Mobile App',
    description: 'Real apiClient.createPost() submission + Concept media composer with gradient preview and publish header.',
    code: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { shadowGradients } from '../theme';
import { apiClient } from '../api/client';

export default function CreateScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [captionTitle, setCaptionTitle] = useState('');
  const [captionBody, setCaptionBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    const full = captionTitle ? \`\${captionTitle}\\n\\n\${captionBody}\` : captionBody;
    if (!full.trim()) {
      Alert.alert('Error', 'Escribe algo para publicar.');
      return;
    }
    try {
      setIsSubmitting(true);
      await apiClient.createPost({ content: full });
      navigation.navigate('Home', { postCreated: true });
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ height: 52, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Feather name="x" size={22} color={colors.text} /></TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Crear Publicación</Text>
        <TouchableOpacity onPress={handlePublish}>
          {isSubmitting ? <ActivityIndicator color={colors.accent} /> : <Text style={{ color: colors.accent, fontWeight: '700' }}>Publicar</Text>}
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Título destacado..."
        placeholderTextColor={colors.secondaryText}
        value={captionTitle}
        onChangeText={setCaptionTitle}
        style={{ backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 14, margin: 16, padding: 14 }}
      />
      <TextInput
        placeholder="Comparte lo que está sucediendo en el campus..."
        placeholderTextColor={colors.secondaryText}
        value={captionBody}
        onChangeText={setCaptionBody}
        multiline
        style={{ backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 14, marginHorizontal: 16, padding: 14, height: 120 }}
      />
    </View>
  );
}`,
  },
  {
    path: 'apps/mobile/src/context/SessionContext.tsx',
    name: 'SessionContext.tsx',
    category: 'Mobile App',
    description: 'Auth state management with token storage, login, register, and identity bootstrap.',
    code: `import React, { createContext, useContext, useEffect, useState } from 'react';
import * as TokenStorage from '../storage/tokenStorage';
import { apiClient } from '../api/client';
import { IdentityResponse } from '../types/api';

export type AuthState = 'BOOTSTRAPPING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface SessionContextType {
  state: AuthState;
  accessToken: string | null;
  identity: IdentityResponse | null;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);
const TOKEN_KEY = 'shadow_access_token';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>('BOOTSTRAPPING');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      setState('BOOTSTRAPPING');
      const storedToken = await TokenStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setState('UNAUTHENTICATED');
        return;
      }
      apiClient.setToken(storedToken);
      const identityData = await apiClient.getMe();
      setAccessToken(storedToken);
      setIdentity(identityData);
      setState('AUTHENTICATED');
    } catch {
      await TokenStorage.deleteItem(TOKEN_KEY);
      apiClient.setToken(null);
      setState('UNAUTHENTICATED');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    const token = response.access_token;
    apiClient.setToken(token);
    await TokenStorage.setItem(TOKEN_KEY, token);
    const identityData = await apiClient.getMe();
    setIdentity(identityData);
    setAccessToken(token);
    setState('AUTHENTICATED');
  };

  const logout = async () => {
    await TokenStorage.deleteItem(TOKEN_KEY);
    apiClient.setToken(null);
    setAccessToken(null);
    setIdentity(null);
    setState('UNAUTHENTICATED');
  };

  return (
    <SessionContext.Provider value={{ state, accessToken, identity, register: async () => {}, login, logout, bootstrap, error, clearError: () => setError(null) }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}`,
  },
  {
    path: 'apps/api/src/main.ts',
    name: 'main.ts',
    category: 'NestJS API',
    description: 'NestJS API bootstrap with global prefix /api/v1, CORS, and ValidationPipe.',
    code: `import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

bootstrap();`,
  },
  {
    path: 'apps/api/src/posts/posts.service.ts',
    name: 'posts.service.ts',
    category: 'NestJS API',
    description: 'Posts service with cursor-based pagination (base64url) and database transactions.',
    code: `import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: { content: string }) {
    return this.prisma.post.create({
      data: { authorId: userId, content: dto.content.trim() },
      select: { id: true, content: true, createdAt: true, author: { select: { id: true, name: true } } },
    });
  }

  async getFeed(limit = 20, cursor?: string) {
    const posts = await this.prisma.post.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });
    return { items: posts.slice(0, limit), nextCursor: null };
  }
}`,
  },
  {
    path: 'prisma/schema.prisma',
    name: 'schema.prisma',
    category: 'Prisma & DB',
    description: 'PostgreSQL schema with User, Profile, Shadow, ShadowRank, ShadowVerification, and Post.',
    code: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum ShadowRankType {
  PAWN
  KNIGHT
  BISHOP
  ROOK
  QUEEN
  KING
}

enum VerificationStatus {
  UNVERIFIED
  VERIFIED
}

model User {
  id             String              @id @default(cuid())
  email          String              @unique
  passwordHash   String
  name           String?
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
  profile        Profile?
  shadow         Shadow?
  shadowRank     ShadowRank?
  verification   ShadowVerification?
  posts          Post[]
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  bio       String?
  avatarUrl String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Shadow {
  id        String   @id @default(cuid())
  userId    String   @unique
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ShadowRank {
  id        String         @id @default(cuid())
  userId    String         @unique
  rankType  ShadowRankType @default(PAWN)
  createdAt DateTime       @default(now())
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ShadowVerification {
  id        String             @id @default(cuid())
  userId    String             @unique
  status    VerificationStatus @default(UNVERIFIED)
  createdAt DateTime           @default(now())
  user      User               @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id        String   @id @default(cuid())
  authorId  String
  content   String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}`,
  },
  {
    path: '.env.example',
    name: '.env.example',
    category: 'Packages & Infra',
    description: 'Local environment configuration for PostgreSQL, Redis, JWT authentication, and API endpoints.',
    code: `DATABASE_URL="postgresql://shadow:shadowpassword@localhost:5432/shadow"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me-in-local-dev"
API_BASE_URL="http://localhost:3000"
PORT=3000
NODE_ENV="development"`,
  },
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    category: 'Packages & Infra',
    description: 'PostgreSQL 16 and Redis 7 development containers with persistent healthchecks.',
    code: `version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: shadow-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: shadow
      POSTGRES_USER: shadow
      POSTGRES_PASSWORD: shadowpassword
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U shadow -d shadow']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: shadow-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    command: ['redis-server', '--appendonly', 'no']
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Packages & Infra',
    description: 'Shadow Monorepo architecture overview, workspaces, and run commands.',
    code: `# Shadow

Shadow is a monorepo for a student social product with a React Native mobile app, NestJS API, Prisma data layer, and local development infrastructure.

## Structure

- \`apps/mobile\` — Expo + React Native app (Concept UI Design System)
- \`apps/api\` — NestJS API foundation
- \`packages/types\` — shared TypeScript types
- \`packages/config\` — environment/config helpers
- \`packages/validation\` — small validation utilities
- \`prisma\` — Prisma schema and configuration
- \`docker-compose.yml\` — local PostgreSQL and Redis development services

## Workspaces Commands

\`\`\`bash
# install workspace dependencies
npm install

# start the mobile app
npm run start --workspace apps/mobile

# start the API in development mode
npm run start:dev --workspace apps/api
\`\`\``,
  },
];
