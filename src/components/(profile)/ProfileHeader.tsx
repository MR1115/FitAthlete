import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';

type Props = {
  fullName: string;
  accountType: string;
  city?: string | null;
  state?: string | null;
  avatarUrl?: string | null;
  onEditPress: () => void;
};

export default function ProfileHeader({
  fullName,
  accountType,
  city,
  state,
  avatarUrl,
  onEditPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Avatar uri={avatarUrl} />
      <Text style={styles.name}>{fullName}</Text>

      <Text style={styles.type}>
        {accountType === 'mentor'
          ? 'Mentor'
          : 'Parent / Athlete'}
      </Text>

      {(city || state) && (
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={15}
            color={colors.textSecondary}
          />

          <Text style={styles.location}>
            {[city, state].filter(Boolean).join(', ')}
          </Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onEditPress}
      >
        <Ionicons
          name="create-outline"
          size={18}
          color={colors.background}
        />

        <Text style={styles.buttonText}>
          Edit Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#353556',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
  },

  type: {
    color: colors.primary,
    marginTop: 6,
    fontWeight: '600',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  location: {
    color: colors.textSecondary,
    marginLeft: 5,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginTop: 22,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 15,
  },
});