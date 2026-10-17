import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSession } from '../context/SessionContext';
import { useTheme } from '../context/ThemeContext';
import { NavigationSizeProvider, useNavigationSize } from '../context/NavigationSizeContext';
import { BottomNavigation } from '../components/BottomNavigation';
import { TabType } from '../types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import ReelsScreen from '../screens/ReelsScreen';
import CreateScreen from '../screens/CreateScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export type RootTabParamList = {
  Home: { postCreated?: boolean } | undefined;
  Discover: undefined;
  Reels: undefined;
  Create: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AppTabsContent() {
  const { colors } = useTheme();
  const { isCompact } = useNavigationSize();

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
            isCompact={isCompact}
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
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
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

function AppTabs() {
  return (
    <NavigationSizeProvider>
      <AppTabsContent />
    </NavigationSizeProvider>
  );
}

function AuthScreens() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

export default function RootNavigator() {
  const { state } = useSession();
  const { colors } = useTheme();

  if (state === 'BOOTSTRAPPING') {
    return (
      <View style={[styles.bootContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {state === 'AUTHENTICATED' ? <AppTabs /> : <AuthScreens />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
