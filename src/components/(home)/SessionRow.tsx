import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  sport: string;
  mentorName: string;
  subtitle: string;
  price?: string;
  color?: string;
  statusLabel?: string;
  onPress: () => void;
};

export default function SessionRow({
  sport,
  mentorName,
  subtitle,
  price,
  color = colors.primary,
  statusLabel,
  onPress,
}: Props) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: color }]} />

      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {sport} with {mentorName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.right}>
        {statusLabel && (
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{statusLabel}</Text>
          </View>
        )}
        {price && <Text style={styles.price}>{price}</Text>}
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#404050',
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  statusPill: {
    backgroundColor: 'rgba(79, 195, 247, 0.14)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusPillText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  price: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});