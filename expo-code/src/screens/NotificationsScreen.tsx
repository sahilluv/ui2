import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../components/NotificationItem';
import { ThemeColors } from '../theme';
import { NotificationItemData } from '../types';

interface NotificationsScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onNavigateBack?: () => void;
  onClearAll?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  colors,
  isDark,
  onNavigateBack,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments'>('all');

  const [notifications, setNotifications] = useState<NotificationItemData[]>([
    {
      id: 'notif_1',
      user: {
        name: 'Elena Rostova',
        username: 'Elena.art',
        avatarGradient: ['#EC4899', '#F43F5E', '#FB7185'],
      },
      actionType: 'like',
      content: 'le gustó tu publicación "SACRIFICE | VIRUS"',
      timeAgo: 'Hace 5 min',
      postThumbnailGradient: ['#4E137D', '#991BEA', '#FF0A78'],
      isRead: false,
    },
    {
      id: 'notif_2',
      user: {
        name: 'Carlos Valenzuela',
        username: 'Carlos_v',
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
      content: 'y a 45 personas más les gustó tu historia.',
      timeAgo: 'Hace 4 h',
      postThumbnailGradient: ['#7A58E6', '#B77DE8', '#F5A7C4'],
      isRead: true,
    },
    {
      id: 'notif_5',
      user: {
        name: 'Alice Cooper',
        username: 'Alice_002',
        avatarGradient: ['#C026D3', '#7928CA', '#3B82F6'],
      },
      actionType: 'mention',
      content: 'te mencionó en un comentario: "@tu.perfil checa esto"',
      timeAgo: 'Ayer',
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
          onPress={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
          activeOpacity={0.7}
        >
          <Text style={[styles.markReadText, { color: colors.accent }]}>
            Marcar leídas
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Filter Pills */}
      <View style={styles.filtersRow}>
        {(['all', 'likes', 'comments'] as const).map((key) => {
          const isSelected = filter === key;
          const label = key === 'all' ? 'Todas' : key === 'likes' ? 'Me gusta' : 'Comentarios';
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setFilter(key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? colors.accent : colors.inputBackground,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? '#FFFFFF' : colors.secondaryText },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Notification List or Empty State */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
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
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Sin notificaciones
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
              No tienes notificaciones en esta categoría por el momento.
            </Text>
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
