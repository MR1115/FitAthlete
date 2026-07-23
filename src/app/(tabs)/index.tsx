import AppCalendar from '@/components/Calendar';
import EventGrid, { type UpcomingEvent } from '@/components/EventGrid';
import HomeHeader from '@/components/HomeHeader';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, globalStyles } from '@/styles/global';
import type { SessionEvent } from '@/types/index';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

const SPORT_COLORS: Record<string, string> = {
  Basketball: '#e08a2c',
  Soccer: '#2c9e5c',
  Baseball: '#c0392b',
  Football: '#8e44ad',
  Tennis: '#d4ac0d',
  Swimming: '#2980b9',
  'Track & Field': '#e74c3c',
  Volleyball: '#16a085',
  Gymnastics: '#e91e8c',
  Golf: '#27ae60',
  Wrestling: '#132b61',
};

interface SessionWithMentor extends SessionEvent {
  mentor_name: string | null;
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
}

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HomeScreen() {
  const { profile } = useAuth();

  if (profile?.account_type === 'mentor') {
    return <MentorHomePlaceholder />;
  }

  return <AthleteHome />;
}

function MentorHomePlaceholder() {
  return (
    <View style={[globalStyles.container, styles.centerContent]}>
      <Ionicons name="construct-outline" size={40} color={colors.textSecondary} />
      <Text style={[globalStyles.title, styles.placeholderTitle]}>Mentor Home</Text>
      <Text style={styles.placeholderBody}>
        Your dashboard — schedule, availability, and booking requests — is coming next.
      </Text>
    </View>
  );
}

function AthleteHome() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<SessionWithMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date().toISOString()));

  const loadSessions = useCallback(async () => {
    if (!profile) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentor:mentor_profile_id ( full_name )')
      .eq('athlete_profile_id', profile.id)
      .neq('status', 'cancelled')
      .order('scheduled_at', { ascending: true });

    if (!error && data) {
      setSessions(
        data.map((row: any) => ({
          ...row,
          mentor_name: row.mentor?.full_name ?? null,
        }))
      );
    }
    setIsLoading(false);
  }, [profile]);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const upcomingEvents: UpcomingEvent[] = useMemo(
    () =>
      sessions
        .filter((s) => new Date(s.scheduled_at).getTime() >= Date.now())
        .map((s) => ({
          id: s.id,
          sport: s.sport,
          mentor: s.mentor_name ?? 'Mentor TBD',
          date: formatEventDate(s.scheduled_at),
          time: formatEventTime(s.scheduled_at),
          location: s.location ?? 'Location TBD',
          price: s.price != null ? `$${s.price}` : 'TBD',
          color: SPORT_COLORS[s.sport] ?? colors.primary,
        })),
    [sessions]
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};
    for (const s of sessions) {
      marks[toDateKey(s.scheduled_at)] = { marked: true, dotColor: colors.primary };
    }
    return marks;
  }, [sessions]);

  const sessionsOnSelectedDate = useMemo(
    () => sessions.filter((s) => toDateKey(s.scheduled_at) === selectedDate),
    [sessions, selectedDate]
  );

  if (!profile) return null;

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <HomeHeader />

      <View style={styles.section}>
        <Text style={globalStyles.sectionTitle}>Upcoming Events</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
        ) : upcomingEvents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={26} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              Nothing booked yet. Head to Explore to find a mentor and schedule a session.
            </Text>
          </View>
        ) : (
          <EventGrid events={upcomingEvents} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={globalStyles.sectionTitle}>Calendar</Text>
        <AppCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          markedDates={markedDates}
        />

        {sessionsOnSelectedDate.length > 0 && (
          <View style={styles.selectedDayCard}>
            <Text style={styles.selectedDayTitle}>
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {sessionsOnSelectedDate.map((s) => (
              <Text key={s.id} style={styles.selectedDayItem}>
                {formatEventTime(s.scheduled_at)} · {s.sport} with {s.mentor_name ?? 'Mentor TBD'}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  placeholderTitle: { fontSize: 20, marginTop: 16, marginLeft: 0, textAlign: 'center' },
  placeholderBody: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: { paddingHorizontal: 24, marginTop: 10 },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  selectedDayCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },
  selectedDayTitle: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  selectedDayItem: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
});