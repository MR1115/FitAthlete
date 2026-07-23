import { colors } from '@/styles/global';
import { StyleSheet, View } from 'react-native';
import { Calendar as RNCalendar, type DateData } from 'react-native-calendars';

interface AppCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  markedDates?: Record<string, { marked?: boolean; dotColor?: string }>;
}

export default function AppCalendar({
  selectedDate,
  onSelectDate,
  markedDates = {},
}: AppCalendarProps) {
  const marks = {
    ...markedDates,
    ...(selectedDate
      ? {
          [selectedDate]: {
            ...(markedDates[selectedDate] ?? {}),
            selected: true,
            selectedColor: colors.primary,
          },
        }
      : {}),
  };

  return (
    <View style={styles.card}>
      <RNCalendar
        current={selectedDate || undefined}
        onDayPress={(day: DateData) => onSelectDate(day.dateString)}
        markedDates={marks}
        theme={{
          backgroundColor: colors.surface,
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.textSecondary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.background,
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.textSecondary,
          dotColor: colors.primary,
          selectedDotColor: colors.background,
          arrowColor: colors.primary,
          monthTextColor: colors.text,
          textMonthFontSize: 16,
          textMonthFontWeight: '700',
          textDayFontSize: 14,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  calendar: {
    borderRadius: 16,
    paddingBottom: 8,
  },
});