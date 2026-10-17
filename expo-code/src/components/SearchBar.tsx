import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  colors: ThemeColors;
  placeholder?: string;
  showScanIcon?: boolean;
  onScanPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  colors,
  placeholder = 'Buscar',
  showScanIcon = false,
  onScanPress,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inputBackground,
          borderColor: colors.border,
        },
      ]}
    >
      <Feather name="search" size={17} color={colors.secondaryText} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        style={[styles.input, { color: colors.text }]}
      />
      {showScanIcon && (
        <TouchableOpacity onPress={onScanPress} activeOpacity={0.7} style={styles.scanButton}>
          <Ionicons name="scan-outline" size={18} color={colors.secondaryText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 42,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  scanButton: {
    padding: 4,
  },
});
