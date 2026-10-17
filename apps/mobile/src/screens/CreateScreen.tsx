import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { shadowGradients } from '../theme';
import { apiClient } from '../api/client';

export default function CreateScreen({ navigation }: any) {
  const { colors } = useTheme();

  const [captionTitle, setCaptionTitle] = useState('');
  const [captionBody, setCaptionBody] = useState('');
  const [postType, setPostType] = useState<'feed' | 'story' | 'event'>('feed');
  const [selectedGradientIndex, setSelectedGradientIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradientPresets = [
    { id: 'neon_violet', name: 'Cyber Violet', colors: shadowGradients.mainFeed },
    { id: 'pastel_rose', name: 'Pastel Dusk', colors: shadowGradients.softPastel },
    { id: 'deep_obsidian', name: 'Moody Blue', colors: shadowGradients.deepMoody },
    { id: 'teal_aurora', name: 'Teal Aurora', colors: shadowGradients.tealCyan },
    { id: 'bronze_warmth', name: 'Bronze Study', colors: shadowGradients.warmBronze },
  ];

  const handlePublish = async () => {
    const title = captionTitle.trim();
    const body = captionBody.trim();
    const fullContent = title ? `${title}\n\n${body}` : body;

    if (!fullContent) {
      Alert.alert('Publicación requerida', 'Por favor ingresa contenido para tu post.');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await apiClient.createPost({ content: fullContent });
      setCaptionTitle('');
      setCaptionBody('');
      navigation.navigate('Home', { postCreated: true });
    } catch (error: any) {
      Alert.alert(
        'Error al publicar',
        error instanceof Error ? error.message : 'No se pudo publicar tu post.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
          disabled={isSubmitting}
        >
          <Feather name="x" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Crear Publicación</Text>
        <TouchableOpacity
          onPress={handlePublish}
          activeOpacity={0.8}
          style={styles.publishHeaderBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Text style={[styles.publishHeaderText, { color: colors.accent }]}>Publicar</Text>
          )}
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
              <Text style={styles.previewTitle} numberOfLines={1}>
                {captionTitle.trim() || 'TITULO DEL POST'}
              </Text>
              <Text style={styles.previewBody} numberOfLines={2}>
                {captionBody.trim() || 'Escribe tu descripción para ver la vista previa...'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* 3. Gradient Palette Picker */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            GRADIENTE VISUAL
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteList}>
            {gradientPresets.map((preset, index) => {
              const isSelected = selectedGradientIndex === index;
              return (
                <TouchableOpacity
                  key={preset.id}
                  onPress={() => setSelectedGradientIndex(index)}
                  activeOpacity={0.8}
                  style={[
                    styles.paletteCard,
                    isSelected && { borderColor: colors.accent, borderWidth: 2 },
                  ]}
                >
                  <LinearGradient
                    colors={preset.colors as any}
                    style={styles.paletteThumb}
                  />
                  <Text
                    style={[
                      styles.paletteName,
                      { color: isSelected ? colors.text : colors.secondaryText },
                    ]}
                  >
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Type Selector Chips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            TIPO DE CONTENIDO
          </Text>
          <View style={styles.chipRow}>
            {(['feed', 'story', 'event'] as const).map((type) => {
              const isSelected = postType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setPostType(type)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.inputBackground,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {type === 'feed' ? 'Post Feed' : type === 'story' ? 'Historia' : 'Evento'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Inputs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            ENCABEZADO / TITULO
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Título destacado..."
            placeholderTextColor={colors.secondaryText}
            value={captionTitle}
            onChangeText={setCaptionTitle}
            maxLength={60}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            DESCRIPCION
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Comparte lo que está sucediendo en el campus..."
            placeholderTextColor={colors.secondaryText}
            value={captionBody}
            onChangeText={setCaptionBody}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  publishHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  publishHeaderText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  previewContainer: {
    marginBottom: 20,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  mediaPreview: {
    height: 190,
    padding: 16,
    justifyContent: 'flex-end',
  },
  previewOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 10,
  },
  previewTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  previewBody: {
    color: '#EEE',
    fontSize: 12,
    lineHeight: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  paletteList: {
    gap: 10,
  },
  paletteCard: {
    width: 90,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  paletteThumb: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    marginBottom: 4,
  },
  paletteName: {
    fontSize: 10,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    fontSize: 14,
  },
});
