import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { lightColors, darkColors } from './src/theme';
import { TabType, ThemeMode } from './src/types';
import { BottomNavigation } from './src/components/BottomNavigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { ReelsScreen } from './src/screens/ReelsScreen';
import { CreateScreen } from './src/screens/CreateScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);

  const isDark = themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigateToNotifications={() => setCurrentTab('notifications')}
            onNavigateToCreate={() => setCurrentTab('create')}
            onNavigateToProfile={() => setCurrentTab('profile')}
          />
        );
      case 'explore':
        return (
          <ExploreScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigateToNotifications={() => setCurrentTab('notifications')}
            onNavigateToCreate={() => setCurrentTab('create')}
          />
        );
      case 'reels':
        return (
          <ReelsScreen
            colors={colors}
            isDark={isDark}
            onAuthorPress={() => setCurrentTab('profile')}
          />
        );
      case 'shop':
        return (
          <ExploreScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onNavigateToNotifications={() => setCurrentTab('notifications')}
            onNavigateToCreate={() => setCurrentTab('create')}
          />
        );
      case 'create':
        return (
          <CreateScreen
            colors={colors}
            isDark={isDark}
            onClose={() => setCurrentTab('home')}
            onPostCreated={() => setCurrentTab('home')}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen
            colors={colors}
            isDark={isDark}
            onNavigateBack={() => setCurrentTab('home')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            colors={colors}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onAddPress={() => setCurrentTab('create')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        {/* Active Screen Content */}
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* 5-Destination Integrated Bottom Navigation */}
        <BottomNavigation
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'notifications') setHasUnreadNotifs(false);
            setCurrentTab(tab);
          }}
          colors={colors}
          unreadNotifications={hasUnreadNotifs}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
