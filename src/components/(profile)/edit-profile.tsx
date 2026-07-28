import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import ProfileAvatarPicker from '@/components/(profile)/ProfileAvatarPicker';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';

const AVATAR_BUCKET = 'avatars';

function getStoragePathFromUrl(url: string) {
  const marker = `/${AVATAR_BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

export default function EditProfileScreen() {
  const { profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [state, setState] = useState(profile?.state ?? '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    if (!profile) return;

    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
      })
      .eq('id', profile.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await refreshProfile();
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={26}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Edit Profile
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <ProfileAvatarPicker size={96} />

        <Text style={styles.photoText}>
          Change your profile photo
        </Text>

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>
          Email
        </Text>

        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>
            {profile?.email}
          </Text>
        </View>

        <Text style={styles.readOnlyHint}>
          Email changes will be supported in a future update.
        </Text>

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>
          City
        </Text>

        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>
          State
        </Text>

        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="State"
          placeholderTextColor={colors.textSecondary}
        />

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  photoText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  readOnlyBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    opacity: 0.7,
  },

  readOnlyText: {
    color: colors.textSecondary,
    fontSize: 15,
  },

  readOnlyHint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },

  error: {
    color: colors.alert,
    marginTop: 18,
    fontSize: 14,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  cancelButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});