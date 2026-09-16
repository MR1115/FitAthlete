import AppCalendar from '@/components/(home)/Calendar';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '../(profile)/Avatar';
import type { BookableMentor } from './BookSession';
import TimeSlotPicker, { TIME_SLOT_HOURS } from './TimeSlotPicker';

type Props = {
  mentor: BookableMentor;
  athleteProfileId: string;
  onChangeMentor: () => void;
};

function todayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function SessionDetailsForm({ mentor, athleteProfileId, onChangeMentor }: Props) {
  const [selectedSport, setSelectedSport] = useState<string | null>(
    mentor.sports.length === 1 ? mentor.sports[0] : null
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState(mentor.default_location ?? '');
  const [bookedRanges, setBookedRanges] = useState<{ start: number; end: number }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset dependent fields whenever the selected mentor changes.
  useEffect(() => {
    setSelectedSport(mentor.sports.length === 1 ? mentor.sports[0] : null);
    setSelectedDate('');
    setSelectedHour(null);
    setLocation(mentor.default_location ?? '');
    setError(null);
  }, [mentor.profile_id]);

  // Load this mentor's existing (non-cancelled) sessions for the chosen day.
  useEffect(() => {
    if (!selectedDate) {
      setBookedRanges([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoadingSlots(true);
      const dayStart = `${selectedDate}T00:00:00`;
      const dayEnd = `${selectedDate}T23:59:59`;
      const { data } = await supabase
        .from('sessions')
        .select('scheduled_at, duration_minutes')
        .eq('mentor_profile_id', mentor.profile_id)
        .neq('status', 'cancelled')
        .gte('scheduled_at', dayStart)
        .lte('scheduled_at', dayEnd);

      if (cancelled) return;
      const ranges = (data ?? []).map((row: any) => {
        const start = new Date(row.scheduled_at).getTime();
        return { start, end: start + row.duration_minutes * 60000 };
      });
      setBookedRanges(ranges);
      setIsLoadingSlots(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, mentor.profile_id]);

  // Recomputed locally (no extra network call) whenever the chosen duration
  // or date changes, so switching duration immediately reflects on the grid.
  const unavailableHours = useMemo(() => {
    const set = new Set<number>();
    if (!selectedDate) return set;
    for (const hour of TIME_SLOT_HOURS) {
      const slotStart = new Date(
        `${selectedDate}T${String(hour).padStart(2, '0')}:00:00`
      ).getTime();
      const slotEnd = slotStart + duration * 60000;
      const conflicts = bookedRanges.some((r) => slotStart < r.end && slotEnd > r.start);
      if (conflicts) set.add(hour);
    }
    return set;
  }, [bookedRanges, duration, selectedDate]);

  useEffect(() => {
    if (selectedHour != null && unavailableHours.has(selectedHour)) {
      setSelectedHour(null);
    }
    // Only re-run when the set of unavailable hours changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unavailableHours]);

  const canSubmit = !!selectedSport && !!selectedDate && selectedHour != null && !isSubmitting;

  async function handleSubmit() {
    if (!selectedSport || !selectedDate || selectedHour == null) {
      setError('Pick a sport, date, and time to continue.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const scheduledAt = new Date(
      `${selectedDate}T${String(selectedHour).padStart(2, '0')}:00:00`
    ).toISOString();

    const { error: insertError } = await supabase.from('sessions').insert({
      athlete_profile_id: athleteProfileId,
      mentor_profile_id: mentor.profile_id,
      sport: selectedSport,
      scheduled_at: scheduledAt,
      duration_minutes: duration,
      location: location.trim() || null,
      price: mentor.hourly_rate,
      status: 'scheduled',
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // `router.back()` depends on there being a real "previous screen" in
    // history — that's not guaranteed (e.g. a web page reload, or a deep
    // link straight into this screen), and `router.canGoBack()` is known to
    // be unreliable in exactly that situation. Replacing to a known-good
    // destination sidesteps the issue entirely, and has the nice side
    // effect of landing right where the new booking is visible.
    router.replace('/bookings');
  }

  return (
    <View>
      <View style={styles.mentorRow}>
        <Avatar uri={mentor.avatar_url} name={mentor.full_name} size={52} />
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{mentor.full_name}</Text>
          <Text style={styles.mentorSports}>{mentor.sports.join(' • ')}</Text>
        </View>
        <Pressable onPress={onChangeMentor}>
          <Text style={styles.changeLink}>Change</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Sport</Text>
      {mentor.sports.length > 1 ? (
        <View style={styles.chipRow}>
          {mentor.sports.map((sport) => (
            <Pressable
              key={sport}
              style={[styles.chip, selectedSport === sport && styles.chipActive]}
              onPress={() => setSelectedSport(sport)}
            >
              <Text style={[styles.chipText, selectedSport === sport && styles.chipTextActive]}>
                {sport}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={styles.readOnlyValue}>{mentor.sports[0] ?? 'Not specified'}</Text>
      )}

      <Text style={styles.label}>Date</Text>
      <AppCalendar
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setSelectedHour(null);
        }}
        minDate={todayDateKey()}
      />

      <Text style={styles.label}>Time</Text>
      <TimeSlotPicker
        selectedHour={selectedHour}
        onSelectHour={setSelectedHour}
        unavailableHours={unavailableHours}
        isLoading={isLoadingSlots}
        disabled={!selectedDate}
      />

      <Text style={styles.label}>Duration</Text>
      <View style={styles.chipRow}>
        {[30, 60, 90].map((mins) => (
          <Pressable
            key={mins}
            style={[styles.chip, duration === mins && styles.chipActive]}
            onPress={() => setDuration(mins)}
          >
            <Text style={[styles.chipText, duration === mins && styles.chipTextActive]}>
              {mins} min
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Central Park Courts"
        placeholderTextColor={colors.textSecondary}
      />

      <View style={styles.priceRow}>
        <Ionicons name="cash-outline" size={18} color={colors.primary} />
        <Text style={styles.priceText}>
          {mentor.hourly_rate != null ? `$${mentor.hourly_rate} / session` : 'Rate not set'}
        </Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.submitButtonText}>Confirm Booking</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  mentorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
  },
  mentorInfo: { flex: 1, marginLeft: 12 },
  mentorName: { color: colors.text, fontWeight: '700', fontSize: 16 },
  mentorSports: { color: colors.primary, fontSize: 13, marginTop: 2 },
  changeLink: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 8, marginTop: 20 },
  readOnlyValue: { color: colors.text, fontSize: 15, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: colors.background, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  priceText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  error: { color: colors.alert, marginTop: 16, fontSize: 13 },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 20,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: colors.background, fontSize: 16, fontWeight: '700' },
});