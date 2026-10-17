import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItemData } from '../types';
import { ThemeColors } from '../theme';

interface NotificationItemProps {
  item: NotificationItemData;
  colors: ThemeColors;
  onPress?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  colors,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: item.isRead ? colors.surface : colors.elevatedSurface,
          borderBottomColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 1. Avatar with Action Badge */}
      <View style={styles.avatarWrapper}>
        <LinearGradient
          colors={item.user.avatarGradient}
          style={styles.avatar}
        />
        <View
          style={[
            styles.actionBadge,
            {
              backgroundColor:
                item.actionType === 'like'
                  ? colors.heartRed
                  : item.actionType === 'follow'
                  ? colors.accent
                  : '#6366F1',
              borderColor: colors.surface,
            },
          ]}
        >
          <Ionicons
            name={
              item.actionType === 'like'
                ? 'heart'
                : item.actionType === 'follow'
                ? 'person-add'
                : 'chatbubble'
            }
            size={9}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* 2. Text Content */}
      <View style={styles.contentWrapper}>
        <Text style={[styles.textLine, { color: colors.text }]} numberOfLines={2}>
          <Text style={styles.usernameText}>{item.user.username} </Text>
          {item.content}
        </Text>
        <Text style={[styles.timeAgo, { color: colors.secondaryText }]}>
          {item.timeAgo}
        </Text>
      </View>

      {/* 3. Post Thumbnail / Action */}
      {item.postThumbnailGradient ? (
        <View style={styles.thumbnailWrapper}>
          <LinearGradient
            colors={item.postThumbnailGradient}
            style={styles.thumbnail}
          />
        </View>
      ) : item.actionType === 'follow' ? (
        <TouchableOpacity
          style={[styles.smallFollowBtn, { backgroundColor: colors.inputBackground }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.smallFollowText, { color: colors.text }]}>Seguir</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  actionBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
    marginRight: 12,
  },
  textLine: {
    fontSize: 13,
    lineHeight: 18,
  },
  usernameText: {
    fontWeight: '700',
  },
  timeAgo: {
    fontSize: 11,
    marginTop: 2,
  },
  thumbnailWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    flex: 1,
  },
  smallFollowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  smallFollowText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
