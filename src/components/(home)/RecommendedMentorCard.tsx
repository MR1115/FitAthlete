import { colors } from '@/styles/global';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { Mentor } from '../(explore)/MentorCard';
import Avatar from '../(profile)/Avatar';

type Props = {
  mentor: Mentor;
  onPress: () => void;
};

export default function RecommendedMentorCard({ mentor, onPress }: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <Avatar uri={mentor.avatar_url} name={mentor.full_name} size={56} />

      <Text style={styles.name} numberOfLines={1}>
        {mentor.full_name}
      </Text>

      <Text style={styles.sports} numberOfLines={1}>
        {mentor.sports.slice(0, 2).join(' • ')}
      </Text>

      {!!mentor.city && (
        <Text style={styles.location} numberOfLines={1}>
          {mentor.city}
          {mentor.state ? `, ${mentor.state}` : ''}
        </Text>
      )}

      {mentor.hourly_rate != null && <Text style={styles.price}>${mentor.hourly_rate}/session</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 152,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginRight: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  sports: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  location: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  price: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 8,
  },
});