import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ReelItem, CommentItem } from '../types';
import { ThemeColors } from '../theme';

interface ReelCommentsDrawerProps {
  visible: boolean;
  reel: ReelItem | null;
  colors: ThemeColors;
  isDark?: boolean;
  onClose: () => void;
  onAddComment?: (reelId: string, text: string) => void;
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    reelId: 'reel_1',
    author: {
      name: 'Marco Rossi',
      username: 'marco.visuals',
      avatarGradient: ['#8B5CF6', '#6366F1', '#3B82F6'],
    },
    text: '¡La luz natural y la paleta de colores en Madrid son impresionantes! Brutal toma 🔥',
    timeAgo: '15m',
    likesCount: 24,
    isLiked: false,
  },
  {
    id: 'c2',
    reelId: 'reel_1',
    author: {
      name: 'Clara Design',
      username: 'clara_design',
      avatarGradient: ['#06B6D4', '#3B82F6', '#6366F1'],
    },
    text: '¿Qué lente y cámara usaste para esta transición suave? Quedó de cine.',
    timeAgo: '42m',
    likesCount: 18,
    isLiked: true,
  },
  {
    id: 'c3',
    reelId: 'reel_1',
    author: {
      name: 'Sofia Martinez',
      username: 'sofia.mtz',
      avatarGradient: ['#FF6B4A', '#FF3366', '#C026D3'],
    },
    text: 'Esa combinación de tonos lilas y dorados es pura poesía visual ✨🙌',
    timeAgo: '2h',
    likesCount: 9,
    isLiked: false,
  },
  {
    id: 'c4',
    reelId: 'reel_2',
    author: {
      name: 'Lucas Vane',
      username: 'lucas.vane',
      avatarGradient: ['#10B981', '#059669', '#047857'],
    },
    text: 'Ghent en otoño tiene una atmósfera incomparable. Grandes tonos terrosos 🤎',
    timeAgo: '1h',
    likesCount: 14,
    isLiked: false,
  },
];

const QUICK_EMOJIS = ['❤️', '🔥', '👏', '🙌', '✨', '😍'];

export const ReelCommentsDrawer: React.FC<ReelCommentsDrawerProps> = ({
  visible,
  reel,
  colors,
  isDark = true,
  onClose,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS);

  if (!reel) return null;

  const reelComments = comments.filter(
    (c) => c.reelId === reel.id || c.reelId === 'reel_1'
  );

  const toggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.isLiked;
          return {
            ...c,
            isLiked: nextLiked,
            likesCount: nextLiked ? c.likesCount + 1 : c.likesCount - 1,
          };
        }
        return c;
      })
    );
  };

  const handleSendComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const newComment: CommentItem = {
      id: `comment_${Date.now()}`,
      reelId: reel.id,
      author: {
        name: 'Tú',
        username: 'tu.perfil',
        avatarGradient: ['#FF0A78', '#991BEA', '#7928CA'],
      },
      text: trimmed,
      timeAgo: 'Ahora',
      likesCount: 0,
      isLiked: false,
    };

    setComments((prev) => [newComment, ...prev]);
    onAddComment?.(reel.id, trimmed);
    setCommentText('');
  };

  const handleAppendEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
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
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={[
                styles.drawerContainer,
                { backgroundColor: isDark ? '#131524' : '#FFFFFF' },
              ]}
            >
              {/* Drag Handle */}
              <View style={styles.handleBar} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text
                    style={[
                      styles.headerTitle,
                      { color: isDark ? '#FFFFFF' : '#12131D' },
                    ]}
                  >
                    Comentarios
                  </Text>
                  <Text
                    style={[
                      styles.headerSub,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    @{reel.author.username} • {reel.comments}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeBtn,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
                  ]}
                  activeOpacity={0.7}
                >
                  <Feather
                    name="x"
                    size={18}
                    color={isDark ? '#E2E8F0' : '#475569'}
                  />
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.commentsList}
                contentContainerStyle={styles.commentsListContent}
              >
                {reelComments.map((item) => (
                  <View key={item.id} style={styles.commentRow}>
                    {/* User Avatar */}
                    <LinearGradient
                      colors={item.author.avatarGradient}
                      style={styles.avatar}
                    />

                    {/* Text Details */}
                    <View style={styles.commentBody}>
                      <View style={styles.authorRow}>
                        <Text
                          style={[
                            styles.authorUsername,
                            { color: isDark ? '#FFFFFF' : '#12131D' },
                          ]}
                        >
                          {item.author.username}
                        </Text>
                        <Text
                          style={[
                            styles.timeAgo,
                            { color: isDark ? '#64748B' : '#94A3B8' },
                          ]}
                        >
                          {item.timeAgo}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.commentText,
                          { color: isDark ? '#E2E8F0' : '#334155' },
                        ]}
                      >
                        {item.text}
                      </Text>
                    </View>

                    {/* Like button */}
                    <TouchableOpacity
                      onPress={() => toggleCommentLike(item.id)}
                      style={styles.commentLikeBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={item.isLiked ? 'heart' : 'heart-outline'}
                        size={16}
                        color={item.isLiked ? '#FF2A55' : isDark ? '#64748B' : '#94A3B8'}
                      />
                      {item.likesCount > 0 && (
                        <Text
                          style={[
                            styles.commentLikeCount,
                            { color: item.isLiked ? '#FF2A55' : isDark ? '#64748B' : '#94A3B8' },
                          ]}
                        >
                          {item.likesCount}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              {/* Quick Emojis Row */}
              <View
                style={[
                  styles.quickEmojisRow,
                  { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                ]}
              >
                {QUICK_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => handleAppendEmoji(emoji)}
                    style={styles.emojiBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Input Section */}
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                <LinearGradient
                  colors={['#FF0A78', '#991BEA', '#7928CA']}
                  style={styles.currentUserAvatar}
                />
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Añadir un comentario..."
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  style={[
                    styles.textInput,
                    { color: isDark ? '#FFFFFF' : '#12131D' },
                  ]}
                  returnKeyType="send"
                  onSubmitEditing={handleSendComment}
                />
                <TouchableOpacity
                  onPress={handleSendComment}
                  disabled={!commentText.trim()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      commentText.trim()
                        ? ['#FF0A78', '#7928CA']
                        : isDark
                        ? ['#2D324D', '#202438']
                        : ['#E2E8F0', '#CBD5E1']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendBtn}
                  >
                    <Feather
                      name="arrow-up"
                      size={16}
                      color={
                        commentText.trim()
                          ? '#FFFFFF'
                          : isDark
                          ? '#64748B'
                          : '#94A3B8'
                      }
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
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
  drawerContainer: {
    maxHeight: '75%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 20,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(148, 163, 184, 0.4)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  headerLeft: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsList: {
    maxHeight: 280,
  },
  commentsListContent: {
    paddingVertical: 14,
    gap: 16,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentBody: {
    flex: 1,
    gap: 3,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorUsername: {
    fontSize: 13,
    fontWeight: '700',
  },
  timeAgo: {
    fontSize: 11,
    fontWeight: '500',
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
  },
  commentLikeBtn: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  commentLikeCount: {
    fontSize: 10,
    fontWeight: '600',
  },
  quickEmojisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 4,
  },
  emojiBtn: {
    padding: 6,
    borderRadius: 14,
  },
  emojiText: {
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  currentUserAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReelCommentsDrawer;
