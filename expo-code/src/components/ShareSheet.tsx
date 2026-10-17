import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PostItem } from '../types';
import { ThemeColors } from '../theme';

interface ShareSheetProps {
  visible: boolean;
  post: PostItem | null;
  colors: ThemeColors;
  isDark?: boolean;
  onClose: () => void;
  onCopyLink?: (post: PostItem) => void;
  onShareToStory?: (post: PostItem) => void;
  onSendToFriends?: (post: PostItem) => void;
}

interface FriendItem {
  id: string;
  name: string;
  username: string;
  avatarGradient: string[];
}

const RECENT_FRIENDS: FriendItem[] = [
  {
    id: 'f1',
    name: 'Ezequias',
    username: 'ezequias.art',
    avatarGradient: ['#FF6B4A', '#FF3366', '#C026D3'],
  },
  {
    id: 'f2',
    name: 'Alice',
    username: 'alice_002',
    avatarGradient: ['#C026D3', '#7928CA', '#3B82F6'],
  },
  {
    id: 'f3',
    name: 'Paulette',
    username: 'paulette_r',
    avatarGradient: ['#FF2D55', '#B026FF', '#4F46E5'],
  },
  {
    id: 'f4',
    name: 'Carlos',
    username: 'carlos_v',
    avatarGradient: ['#06B6D4', '#3B82F6', '#6366F1'],
  },
];

export const ShareSheet: React.FC<ShareSheetProps> = ({
  visible,
  post,
  colors,
  isDark = true,
  onClose,
  onCopyLink,
  onShareToStory,
  onSendToFriends,
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedToStory, setSharedToStory] = useState(false);
  const [sentFriends, setSentFriends] = useState<{ [id: string]: boolean }>({});

  if (!post) return null;

  const handleCopyLink = () => {
    setCopied(true);
    onCopyLink?.(post);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareToStory = () => {
    setSharedToStory(true);
    onShareToStory?.(post);
    setTimeout(() => {
      setSharedToStory(false);
      onClose();
    }, 1200);
  };

  const handleToggleSendFriend = (friendId: string) => {
    setSentFriends((prev) => ({
      ...prev,
      [friendId]: !prev[friendId],
    }));
    onSendToFriends?.(post);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContainer,
                { backgroundColor: isDark ? '#141624' : '#FFFFFF' },
              ]}
            >
              {/* Drag Handle Indicator */}
              <View style={styles.handleBar} />

              {/* Sheet Header */}
              <View style={styles.headerRow}>
                <Text
                  style={[
                    styles.headerTitle,
                    { color: isDark ? '#FFFFFF' : '#12131D' },
                  ]}
                >
                  Compartir publicación
                </Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Feather
                    name="x"
                    size={20}
                    color={isDark ? '#94A3B8' : '#64748B'}
                  />
                </TouchableOpacity>
              </View>

              {/* Post Preview Snippet */}
              <View
                style={[
                  styles.previewCard,
                  {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <LinearGradient
                  colors={post.imageGradient}
                  style={styles.previewImage}
                />
                <View style={styles.previewMeta}>
                  <Text
                    style={[
                      styles.previewAuthor,
                      { color: isDark ? '#FFFFFF' : '#12131D' },
                    ]}
                    numberOfLines={1}
                  >
                    @{post.author.username}
                  </Text>
                  <Text
                    style={[
                      styles.previewCaption,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                    numberOfLines={2}
                  >
                    {post.captionTitle} — {post.captionBody}
                  </Text>
                </View>
              </View>

              {/* Three Main Action Options: Copy Link, Share to Story, Send to Friends */}
              <View style={styles.actionsRow}>
                {/* 1. Copy Link */}
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleCopyLink}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      {
                        backgroundColor: copied
                          ? '#10B981'
                          : isDark
                          ? '#23273D'
                          : '#F1F5F9',
                      },
                    ]}
                  >
                    {copied ? (
                      <Feather name="check" size={22} color="#FFFFFF" />
                    ) : (
                      <Feather
                        name="link-2"
                        size={22}
                        color={isDark ? '#FFFFFF' : '#12131D'}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.actionLabel,
                      {
                        color: copied
                          ? '#10B981'
                          : isDark
                          ? '#E2E8F0'
                          : '#1E293B',
                      },
                    ]}
                  >
                    {copied ? '¡Copiado!' : 'Copiar enlace'}
                  </Text>
                </TouchableOpacity>

                {/* 2. Share to Story */}
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={handleShareToStory}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF0A78', '#991BEA', '#7928CA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionIconCircle}
                  >
                    {sharedToStory ? (
                      <Feather name="check" size={22} color="#FFFFFF" />
                    ) : (
                      <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                    )}
                  </LinearGradient>
                  <Text
                    style={[
                      styles.actionLabel,
                      {
                        color: sharedToStory
                          ? '#FF0A78'
                          : isDark
                          ? '#E2E8F0'
                          : '#1E293B',
                      },
                    ]}
                  >
                    {sharedToStory ? '¡Publicado!' : 'Tu historia'}
                  </Text>
                </TouchableOpacity>

                {/* 3. Send to Friends */}
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => onSendToFriends?.(post)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.actionIconCircle,
                      { backgroundColor: isDark ? '#23273D' : '#F1F5F9' },
                    ]}
                  >
                    <Feather
                      name="send"
                      size={20}
                      color={isDark ? '#FFFFFF' : '#12131D'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.actionLabel,
                      { color: isDark ? '#E2E8F0' : '#1E293B' },
                    ]}
                  >
                    Enviar a amigos
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Send to Friends Quick List */}
              <View style={styles.friendsSection}>
                <Text
                  style={[
                    styles.sectionHeading,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Amigos recientes
                </Text>
                <View style={styles.friendsList}>
                  {RECENT_FRIENDS.map((friend) => {
                    const isSent = !!sentFriends[friend.id];
                    return (
                      <View key={friend.id} style={styles.friendRow}>
                        <View style={styles.friendLeft}>
                          <LinearGradient
                            colors={friend.avatarGradient}
                            style={styles.friendAvatar}
                          />
                          <View>
                            <Text
                              style={[
                                styles.friendName,
                                { color: isDark ? '#FFFFFF' : '#12131D' },
                              ]}
                            >
                              {friend.name}
                            </Text>
                            <Text
                              style={[
                                styles.friendUsername,
                                { color: isDark ? '#64748B' : '#94A3B8' },
                              ]}
                            >
                              @{friend.username}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => handleToggleSendFriend(friend.id)}
                          style={[
                            styles.sendButton,
                            isSent
                              ? styles.sendButtonActive
                              : isDark
                              ? styles.sendButtonDark
                              : styles.sendButtonLight,
                          ]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.sendButtonText,
                              isSent && { color: '#FFFFFF' },
                            ]}
                          >
                            {isSent ? 'Enviado' : 'Enviar'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(148, 163, 184, 0.4)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  previewMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  previewAuthor: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  previewCaption: {
    fontSize: 11,
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
    minWidth: 84,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  friendsSection: {
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  friendsList: {
    gap: 12,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendName: {
    fontSize: 14,
    fontWeight: '700',
  },
  friendUsername: {
    fontSize: 12,
    marginTop: 1,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  sendButtonActive: {
    backgroundColor: '#10B981',
  },
  sendButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  sendButtonLight: {
    backgroundColor: '#F1F5F9',
  },
  sendButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
  },
});

export default ShareSheet;
