import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from '../(profile)/Avatar';

export type Mentor = {
  profile_id: string;
  full_name: string;
  city: string | null;
  state: string | null;
  sports: string[];
  hourly_rate: number | null;
  years_experience: number | null;
  avatar_url: string | null;
};

type Props = {
  mentor: Mentor;
  onPress: () => void;
};

export default function MentorCard({
  mentor,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {/* Profile Images */}
      <View style={styles.avatar}>
        <Avatar
          uri={mentor.avatar_url}
          name={mentor.full_name}
          size={64}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {mentor.full_name}
        </Text>

        <Text style={styles.sports}>
          {mentor.sports.join(' • ')}
        </Text>

        {!!mentor.city && (
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />

            <Text style={styles.detail}>
              {mentor.city}
              {mentor.state ? `, ${mentor.state}` : ''}
            </Text>
          </View>
        )}

        <View style={styles.bottomRow}>
          {mentor.hourly_rate != null && (
            <Text style={styles.price}>
              ${mentor.hourly_rate}/session
            </Text>
          )}

          {mentor.years_experience != null && (
            <Text style={styles.exp}>
              {mentor.years_experience} yrs
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },

  pressed: {
    opacity: 0.8,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3a3a5a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 17,
  },

  sports: {
    color: colors.primary,
    marginTop: 4,
    fontSize: 13,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  detail: {
    color: colors.textSecondary,
    marginLeft: 5,
    fontSize: 13,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  price: {
    color: colors.text,
    fontWeight: '600',
  },

  exp: {
    color: colors.textSecondary,
  },
});