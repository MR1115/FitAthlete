import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type EventCardProps = {
  sport: string;
  mentor: string;
  date: string;
  time: string;
  location: string;
  price: string;
  color?: string;
  onPress?: () => void;
};

export default function EventCard({
  sport,
  mentor,
  date,
  time,
  location,
  price,
  color = colors.primary,
  onPress,
}: EventCardProps) {
  const content = (
    <>
      <Text style={styles.title} numberOfLines={1}>
        {sport}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        Mentor: {mentor}
      </Text>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
        <Text style={styles.value} numberOfLines={1}>
          {date}
        </Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
        <Text style={styles.value} numberOfLines={1}>
          {time}
        </Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
        <Text style={styles.value} numberOfLines={1}>
          {location}
        </Text>
      </View>
      <Text style={styles.price}>{price}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { borderLeftColor: color },
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.card, { borderLeftColor: color }]}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    flexBasis: '47%',
    flexGrow: 1,
    borderLeftWidth: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
});