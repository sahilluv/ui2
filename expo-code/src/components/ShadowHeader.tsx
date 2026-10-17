import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';

interface ShadowHeaderProps {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme?: () => void;
  onAddPress?: () => void;
  onNotificationsPress?: () => void;
  unreadCount?: number;
}

export const ShadowHeader: React.FC<ShadowHeaderProps> = ({
  colors,
  isDark,
  onToggleTheme,
  onAddPress,
  onNotificationsPress,
  unreadCount = 2,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Left Action: Menu / Options or Back */}
      <TouchableOpacity 
        style={[styles.iconButton, { borderColor: colors.border }]} 
        onPress={onAddPress}
        activeOpacity={0.7}
      >
        <Feather name="plus" size={20} color={colors.text} />
      </TouchableOpacity>

      {/* Center: Shadow Logo Wordmark */}
      <View style={styles.brandContainer}>
        <Text style={[styles.brandText, { color: colors.text }]}>Shadow</Text>
      </View>

      {/* Right Action: + Create, Notifications & Theme Switch */}
      <View style={styles.rightGroup}>
        {onToggleTheme && (
          <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: colors.inputBackground }]} 
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDark ? "sunny-outline" : "moon-outline"} 
              size={16} 
              color={colors.text} 
            />
          </TouchableOpacity>
        )}

        {/* Top Right Corner + Button (Keep top corner create button) */}
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onAddPress}
          activeOpacity={0.7}
        >
          <Feather name="plus-square" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onNotificationsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="heart-outline" size={22} color={colors.text} />
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.badgeBackground }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  brandContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 28,
    fontFamily: 'Satisfy', // Cursive script font, falls back to italic
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
