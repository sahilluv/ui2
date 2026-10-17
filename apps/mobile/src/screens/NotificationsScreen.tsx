import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../components/NotificationItem';
import { useTheme } from '../context/ThemeContext';
import { NotificationItemData } from '../types';

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments'>('all');

  const [notifications, setNotifications] = useState<NotificationItemData[]>([
    {
      id: 'notif_1',
      user: {
        name: 'Elena Rostova',
        username: 'elena.art',
        avatarGradient: ['#EC4899', '#F43F5E', '#FB7185'],
      },
      actionType: 'like',
      content: 'le gustó tu publicación del campus.',
      timeAgo: 'Hace 5 min',
      postThumbnailGradient: ['#4E137D', '#991BEA', '#FF0A78'],
      isRead: false,
    },
    {
      id: 'notif_2',
      user: {
        name: 'Carlos Valenzuela',
        username: 'carlos_v',
        avatarGradient: ['#06B6D4', '#3B82F6', '#6366F1'],
      },
      actionType: 'comment',
      content: 'comentó: "La paleta de color y la composición son increíbles 🔥"',
      timeAgo: 'Hace 23 min',
      postThumbnailGradient: ['#4E137D', '#991BEA', '#FF0A78'],
      isRead: false,
    },
    {
      id: 'notif_3',
      user: {
        name: 'Sofia Mendez',
        username: 'sofia_art',
        avatarGradient: ['#F59E0B', '#D97706', '#78350F'],
      },
      actionType: 'follow',
      content: 'ha comenzado a seguirte.',
      timeAgo: 'Hace 2 h',
      isRead: true,
    },
    {
      id: 'notif_4',
      user: {
        name: 'Marco Rossi',
        username: 'marco.visuals',
        avatarGradient: ['#8B5CF6', '#6366F1', '#3B82F6'],
      },
      actionType: 'like',
      content: 'y a 45 personas más les gustó tu post.',
      timeAgo: 'Hace 4 h',
      postThumbnailGradient: ['#7A58E6', '#B77DE8', '#F5A7C4'],
      isRead: true,
    },
  ]);

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'likes') return item.actionType === 'like';
    if (filter === 'comments') return item.actionType === 'comment';
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notificaciones
        </Text>
        <TouchableOpacity
          onPress={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          }}
          style={styles.clearBtn}
        >
          <Text style={[styles.clearBtnText, { color: colors.accent }]}>
            Marcar leídas
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Filter Pills */}
      <View style={[styles.filterBar, { borderBottomColor: colors.border }]}>
        {(['all', 'likes', 'comments'] as const).map((tab) => {
          const isActive = filter === tab;
          const label = tab === 'all' ? 'Todas' : tab === 'likes' ? 'Me gusta' : 'Comentarios';
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[
                styles.filterPill,
                isActive && {
                  backgroundColor: colors.accent,
                  borderColor: colors.accent,
                },
                !isActive && {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? '#FFFFFF' : colors.secondaryText },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Notification List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {filteredNotifications.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            colors={colors}
            onPress={() => {
              setNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
              );
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollBody: {
    paddingVertical: 8,
  },
});
