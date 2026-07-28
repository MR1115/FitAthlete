import Avatar from '@/components/(profile)/Avatar';
import { useAuth } from '@/context/AuthContext';
import { deleteAvatarByUrl, uploadAvatar, type PickedImage } from '@/lib/avatar';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ProfileAvatarPickerProps {
  size?: number;
}

export default function ProfileAvatarPicker({ size = 96 }: ProfileAvatarPickerProps) {
  const { session, profile, refreshProfile } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function openMenu() {
    setErrorMsg(null);
    setMenuVisible(true);
  }

  function closeMenu() {
    setMenuVisible(false);
  }

  async function processNewImage(asset: PickedImage) {
    if (!session) return;
    setErrorMsg(null);
    setIsUploading(true);

    const previousUrl = profile?.avatar_url ?? null;
    let newUrl: string | null = null;

    try {
      newUrl = await uploadAvatar(session.user.id, asset);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newUrl, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      await refreshProfile();

      if (previousUrl) deleteAvatarByUrl(previousUrl).catch(() => {});
    } catch (err: any) {
      if (newUrl) deleteAvatarByUrl(newUrl).catch(() => {});
      setErrorMsg(err?.message ?? 'Something went wrong uploading your photo.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleTakePhoto() {
    closeMenu();
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setErrorMsg('Camera access is needed to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processNewImage(result.assets[0]);
    }
  }

  async function handlePickFromLibrary() {
    closeMenu();
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setErrorMsg('Photo library access is needed to choose a picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      exif: false,
      allowsMultipleSelection: false,
    });
    if (!result.canceled && result.assets[0]) {
      await processNewImage(result.assets[0]);
    }
  }

  async function handleRemove() {
    closeMenu();
    if (!session || !profile?.avatar_url) return;
    setErrorMsg(null);
    setIsUploading(true);
    const previousUrl = profile.avatar_url;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      deleteAvatarByUrl(previousUrl).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Something went wrong removing your photo.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={openMenu}
        disabled={isUploading}
        style={[styles.avatarWrap, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Avatar uri={profile?.avatar_url ?? null} name={profile?.full_name} size={size} />

        {isUploading && (
          <View style={[styles.overlay, { borderRadius: size / 2 }]}>
            <ActivityIndicator color={colors.text} />
          </View>
        )}

        <View style={styles.editBadge}>
          <Ionicons name="camera" size={15} color={colors.background} />
        </View>
      </Pressable>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Profile Photo</Text>

            {Platform.OS !== 'web' && (
              <Pressable style={styles.option} onPress={handleTakePhoto}>
                <Ionicons name="camera-outline" size={20} color={colors.text} />
                <Text style={styles.optionText}>Take Photo</Text>
              </Pressable>
            )}

            <Pressable style={styles.option} onPress={handlePickFromLibrary}>
              <Ionicons name="images-outline" size={20} color={colors.text} />
              <Text style={styles.optionText}>Choose from Library</Text>
            </Pressable>

            {profile?.avatar_url && (
              <Pressable style={styles.option} onPress={handleRemove}>
                <Ionicons name="trash-outline" size={20} color={colors.alert} />
                <Text style={[styles.optionText, { color: colors.alert }]}>Remove Photo</Text>
              </Pressable>
            )}

            <Pressable style={styles.cancelOption} onPress={closeMenu}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 28, marginBottom: 4 },
  avatarWrap: { position: 'relative' },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  errorText: {
    color: colors.alert,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  sheetTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  optionText: { color: colors.text, fontSize: 15, fontWeight: '500' },
  cancelOption: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  cancelText: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },
});