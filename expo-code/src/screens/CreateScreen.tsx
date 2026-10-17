import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors, shadowGradients } from '../theme';

interface CreateScreenProps {
  colors: ThemeColors;
  isDark: boolean;
  onPostCreated?: (newPost: any) => void;
  onClose?: () => void;
}

export const CreateScreen: React.FC<CreateScreenProps> = ({
  colors,
  isDark,
  onPostCreated,
  onClose,
}) => {
  const [captionTitle, setCaptionTitle] = useState('');
  const [captionBody, setCaptionBody] = useState('');
  const [postType, setPostType] = useState<'feed' | 'story' | 'igtv'>('feed');
  const [visibility, setVisibility] = useState<'public' | 'followers' | 'close_friends'>('public');
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);

  const gradientPresets = [
    { id: 'neon_violet', name: 'Cyber Violet', colors: shadowGradients.mainFeed },
    { id: 'pastel_rose', name: 'Pastel Dusk', colors: shadowGradients.softPastel },
    { id: 'deep_obsidian', name: 'Moody Blue', colors: shadowGradients.deepMoody },
    { id: 'teal_aurora', name: 'Teal Aurora', colors: shadowGradients.tealCyan },
    { id: 'bronze_warmth', name: 'Bronze Study', colors: shadowGradients.warmBronze },
  ];

  const handlePublish = () => {
    if (!captionTitle.trim() && !captionBody.trim()) {
      Alert.alert('Publicación requerida', 'Por favor ingresa un título o descripción para tu post.');
      return;
    }

    const newPost = {
      id: `post_${Date.now()}`,
      author: {
        name: 'Tu Perfil',
        username: 'tu.perfil',
        avatarGradient: ['#FF0A78', '#991BEA', '#6366F1'],
      },
      timeAgo: 'Justo ahora',
      imageGradient: gradientPresets[selectedGradientIndex].colors,
      likesCount: 0,
      commentsCount: 0,
      likedByText: 'Sé el primero en reaccionar',
      captionTitle: captionTitle.trim() || 'NEW VISUAL',
      captionBody: captionBody.trim() || 'Shared via Shadow Mobile App.',
      totalPages: 1,
      currentPage: 1,
      isLiked: false,
    };

    onPostCreated?.(newPost);
    Alert.alert('¡Publicado!', 'Tu post se ha compartido en el feed de Shadow.');
    setCaptionTitle('');
    setCaptionBody('');
    onClose?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Feather name="x" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Crear Publicación</Text>
        <TouchableOpacity
          onPress={handlePublish}
          activeOpacity={0.8}
          style={styles.publishHeaderBtn}
        >
          <Text style={[styles.publishHeaderText, { color: colors.accent }]}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* 2. Media Preview Card */}
        <View style={styles.previewContainer}>
          <LinearGradient
            colors={gradientPresets[selectedGradientIndex].colors as any}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.95, y: 0.95 }}
            style={styles.mediaPreview}
          >
            <View style={styles.previewOverlay}>
              <View style={styles.previewBadge}>
                <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                <Text style={styles.previewBadgeText}>
                  {gradientPresets[selectedGradientIndex].name}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 3. Gradient Preset Selector */}
        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Elegir Estilo de Color / Gradiente
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsRow}>
          {gradientPresets.map((preset, idx) => {
            const isSelected = selectedGradientIndex === idx;
            return (
              <TouchableOpacity
                key={preset.id}
                onPress={() => setSelectedGradientIndex(idx)}
                style={[
                  styles.presetChip,
                  { borderColor: isSelected ? colors.accent : colors.border },
                ]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={preset.colors as any}
                  style={styles.presetColorCircle}
                />
                <Text
                  style={[
                    styles.presetChipText,
                    { color: isSelected ? colors.text : colors.secondaryText },
                  ]}
                >
                  {preset.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Caption Fields */}
        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Título de la Obra
        </Text>
        <TextInput
          value={captionTitle}
          onChangeText={setCaptionTitle}
          placeholder="Ej: SACRIFICE | PROTOCOL"
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.titleInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Descripción y Hashtags
        </Text>
        <TextInput
          value={captionBody}
          onChangeText={setCaptionBody}
          placeholder="Escribe la historia o inspiración detrás de tu trabajo..."
          placeholderTextColor={colors.secondaryText}
          multiline
          numberOfLines={4}
          style={[
            styles.captionInput,
            {
              backgroundColor: colors.inputBackground,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* 5. Post Type Selector */}
        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Formato de Publicación
        </Text>
        <View style={styles.segmentedRow}>
          {(['feed', 'story', 'igtv'] as const).map((type) => {
            const isSelected = postType === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setPostType(type)}
                style={[
                  styles.segmentBtn,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.inputBackground,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    { color: isSelected ? '#FFFFFF' : colors.secondaryText },
                  ]}
                >
                  {type === 'feed' ? 'Feed' : type === 'story' ? 'Historia' : 'IGTV'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 6. Visibility Selector */}
        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Audiencia y Visibilidad
        </Text>
        <View style={styles.visibilityOptions}>
          {[
            { id: 'public', label: 'Público', icon: 'globe-outline' },
            { id: 'followers', label: 'Seguidores', icon: 'people-outline' },
            { id: 'close_friends', label: 'Amigos Cercanos', icon: 'star-outline' },
          ].map((item) => {
            const isSelected = visibility === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setVisibility(item.id as any)}
                style={[
                  styles.visibilityItem,
                  {
                    backgroundColor: isSelected ? colors.elevatedSurface : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={isSelected ? colors.accent : colors.secondaryText}
                />
                <Text
                  style={[
                    styles.visibilityText,
                    { color: isSelected ? colors.text : colors.secondaryText },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 7. Primary Publish Button */}
        <TouchableOpacity
          onPress={handlePublish}
          activeOpacity={0.85}
          style={styles.publishBtnWrapper}
        >
          <LinearGradient
            colors={colors.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.publishMainBtn}
          >
            <Text style={styles.publishMainBtnText}>Compartir Obra</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  publishHeaderBtn: {
    padding: 6,
  },
  publishHeaderText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollBody: {
    padding: 18,
  },
  previewContainer: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  mediaPreview: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end',
  },
  previewOverlay: {
    flexDirection: 'row',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsRow: {
    marginBottom: 10,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 10,
    gap: 8,
  },
  presetColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  titleInput: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    fontSize: 14,
  },
  captionInput: {
    height: 90,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentBtn: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  visibilityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  visibilityItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  visibilityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  publishBtnWrapper: {
    marginTop: 26,
  },
  publishMainBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF0A78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  publishMainBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
