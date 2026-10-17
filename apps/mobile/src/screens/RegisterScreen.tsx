import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSession } from '../context/SessionContext';
import { useTheme } from '../context/ThemeContext';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useSession();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);
      clearError();
      await register(email, password, name.trim() || undefined);
    } catch (err: any) {
      Alert.alert('Error de registro', err?.message || 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.brandHeader}>
        <LinearGradient
          colors={colors.accentGradient}
          style={styles.logoBadge}
        >
          <Text style={styles.logoBadgeText}>S</Text>
        </LinearGradient>
        <Text style={[styles.brandTitle, { color: colors.text }]}>Shadow</Text>
        <Text style={[styles.brandSubtitle, { color: colors.secondaryText }]}>
          Únete a la comunidad de tu campus
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.formTitle, { color: colors.text }]}>Crear Cuenta</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>NOMBRE COMPLETO</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="ej. Mauricio Lopez"
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>CORREO ELECTRÓNICO</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="usuario@universidad.edu"
            placeholderTextColor={colors.secondaryText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>CONTRASEÑA</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={colors.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
          style={styles.submitBtnContainer}
        >
          <LinearGradient
            colors={colors.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Crear Cuenta</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.switchAuthBtn}
        >
          <Text style={[styles.switchAuthText, { color: colors.secondaryText }]}>
            ¿Ya tienes cuenta?{' '}
            <Text style={{ color: colors.accent, fontWeight: '700' }}>Inicia Sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#FF0A78',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  brandTitle: {
    fontSize: 34,
    fontFamily: 'Satisfy',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  brandSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
  },
  submitBtnContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  switchAuthBtn: {
    marginTop: 18,
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 13,
  },
  errorText: {
    color: '#FF2A55',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
});
