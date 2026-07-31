import { colors } from '@/styles/global';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export const TIME_SLOT_HOURS: number[] = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm starts

export function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}

type Props = {
  selectedHour: number | null;
  onSelectHour: (hour: number) => void;
  unavailableHours: Set<number>;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function TimeSlotPicker({
  selectedHour,
  onSelectHour,
  unavailableHours,
  isLoading,
  disabled,
}: Props) {
  if (disabled) {
    return <Text style={styles.hint}>Pick a date above to see available times.</Text>;
  }

  if (isLoading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />;
  }

  return (
    <View style={styles.row}>
      {TIME_SLOT_HOURS.map((hour) => {
        const isUnavailable = unavailableHours.has(hour);
        const isSelected = selectedHour === hour;

        return (
          <Pressable
            key={hour}
            disabled={isUnavailable}
            onPress={() => onSelectHour(hour)}
            style={[
              styles.chip,
              isSelected && styles.chipActive,
              isUnavailable && styles.chipDisabled,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                isSelected && styles.chipTextActive,
                isUnavailable && styles.chipTextDisabled,
              ]}
            >
              {formatHourLabel(hour)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  chipTextDisabled: {
    textDecorationLine: 'line-through',
  },
});