import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  sport: string;
  mentorName: string;
  whenLabel: string;
  location: string;
  price: string;
  color?: string;
  onPress: () => void;
};

export default function NextSessionCard({
  sport,
  mentorName,
  whenLabel,
  location,
  price,
  color = colors.primary,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: color },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <View style={styles.sportPill}>
          <Text style={styles.sportPillText}>{sport}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>

      <Text style={styles.when}>{whenLabel}</Text>
      <Text style={styles.mentor}>with {mentorName}</Text>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportPill: {
    backgroundColor: 'rgba(79, 195, 247, 0.14)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sportPillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  price: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  when: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
  },
  mentor: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  location: {
    color: colors.textSecondary,
    fontSize: 13,
    flexShrink: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 18,
  },
  footerText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});