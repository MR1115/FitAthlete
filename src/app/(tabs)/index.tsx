import type { Mentor } from '@/components/(explore)/MentorCard';
import MentorPreview from '@/components/(explore)/MentorPreview';
import AppCalendar from '@/components/(home)/Calendar';
import DashboardSection from '@/components/(home)/DashboardSection';
import EventGrid, { type UpcomingEvent } from '@/components/(home)/EventGrid';
import HomeHeader from '@/components/(home)/HomeHeader';
import NextSessionCard from '@/components/(home)/NextSessionCard';
import RecentSessionsList, { type RecentSession } from '@/components/(home)/RecentSessionList';
import RecommendedMentors from '@/components/(home)/RecommendedMentors';
import SessionDetailSheet, { type SessionDetail } from '@/components/(home)/SessionDetailSheet';
import SessionRow from '@/components/(home)/SessionRow';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { spacing } from '@/styles/dashboard';
import { colors, globalStyles } from '@/styles/global';
import type { SessionEvent } from '@/types/index';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

type RecommendedMentorRow = {
  profile_id: string;
  bio: string | null;
  sports: string[];
  hourly_rate: number | null;
  years_experience: number | null;
  profiles: {
    full_name: string;
    city: string | null;
    state: string | null;
    avatar_url: string | null;
  } | null;
};

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

// "Today at 4:00 PM" / "Tomorrow at 4:00 PM" / "July 30, 2026 at 4:00 PM"
function formatRelativeWhen(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / 86400000);
  const time = formatEventTime(iso);

  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Tomorrow at ${time}`;
  return `${formatEventDate(iso)} at ${time}`;
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
  const [selectedSession, setSelectedSession] = useState<SessionWithMentor | null>(null);

  const [recommendedMentorsRaw, setRecommendedMentorsRaw] = useState<Mentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

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

  // Fetches candidate mentors matching the athlete's sports (falls back to a
  // general list if the athlete hasn't set sports, or the query fails). This
  // doesn't factor in already-booked mentors itself — that's handled below in
  // a cheap derived `useMemo` so it always stays in sync with `sessions`
  // without needing to re-hit Supabase every time a booking changes.
  const loadRecommendedMentors = useCallback(async () => {
    if (!profile) return;
    setIsLoadingMentors(true);

    const { data: athleteRow } = await supabase
      .from('athlete_profiles')
      .select('sports')
      .eq('profile_id', profile.id)
      .maybeSingle();

    const athleteSports: string[] = (athleteRow as { sports: string[] } | null)?.sports ?? [];

    let query = supabase
      .from('mentor_profiles')
      .select(
        `
        profile_id,
        bio,
        sports,
        hourly_rate,
        years_experience,
        profiles (
          full_name,
          city,
          state,
          avatar_url
        )
      `
      )
      .limit(10);

    if (athleteSports.length > 0) {
      query = query.overlaps('sports', athleteSports);
    }

    const { data, error } = await query;

    if (error || !data) {
      setRecommendedMentorsRaw([]);
      setIsLoadingMentors(false);
      return;
    }

    const mapped: Mentor[] = (data as unknown as RecommendedMentorRow[])
      .map((mentor) => ({
        profile_id: mentor.profile_id,
        bio: mentor.bio,
        full_name: mentor.profiles?.full_name ?? '',
        city: mentor.profiles?.city ?? null,
        state: mentor.profiles?.state ?? null,
        avatar_url: mentor.profiles?.avatar_url ?? null,
        sports: mentor.sports ?? [],
        hourly_rate: mentor.hourly_rate,
        years_experience: mentor.years_experience,
      }))
      .sort((a, b) => {
        const aSameCity = a.city && a.city === profile.city ? 1 : 0;
        const bSameCity = b.city && b.city === profile.city ? 1 : 0;
        return bSameCity - aSameCity;
      });

    setRecommendedMentorsRaw(mapped);
    setIsLoadingMentors(false);
  }, [profile]);

  useEffect(() => {
    loadRecommendedMentors();
  }, [loadRecommendedMentors]);

  // Exclude mentors the athlete already has a session with, and cap at 6.
  // Recomputed for free whenever `sessions` changes — no extra network call.
  const recommendedMentors: Mentor[] = useMemo(() => {
    const bookedMentorIds = new Set(
      sessions.map((s) => s.mentor_profile_id).filter((id): id is string => !!id)
    );
    return recommendedMentorsRaw.filter((m) => !bookedMentorIds.has(m.profile_id)).slice(0, 6);
  }, [recommendedMentorsRaw, sessions]);

  // `sessions` is sorted ascending by `scheduled_at`, so the first entry at
  // or after "now" is the next session.
  const nextSession = useMemo(
    () => sessions.find((s) => new Date(s.scheduled_at).getTime() >= Date.now()) ?? null,
    [sessions]
  );

  const upcomingEvents: UpcomingEvent[] = useMemo(
    () =>
      sessions
        .filter(
          (s) => s.id !== nextSession?.id && new Date(s.scheduled_at).getTime() >= Date.now()
        )
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
    [sessions, nextSession]
  );

  const recentSessions: RecentSession[] = useMemo(
    () =>
      sessions
        .filter((s) => new Date(s.scheduled_at).getTime() < Date.now())
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
        .slice(0, 5)
        .map((s) => ({
          id: s.id,
          sport: s.sport,
          mentorName: s.mentor_name ?? 'Mentor TBD',
          dateLabel: formatEventDate(s.scheduled_at),
          price: s.price != null ? `$${s.price}` : 'TBD',
          color: SPORT_COLORS[s.sport] ?? colors.primary,
          statusLabel: 'Completed',
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

  function findSessionById(id: string) {
    const match = sessions.find((s) => s.id === id);
    if (match) setSelectedSession(match);
  }

  const selectedSessionDetail: SessionDetail | null = useMemo(() => {
    if (!selectedSession) return null;
    return {
      id: selectedSession.id,
      sport: selectedSession.sport,
      mentorName: selectedSession.mentor_name ?? 'Mentor TBD',
      scheduledAt: selectedSession.scheduled_at,
      location: selectedSession.location,
      price: selectedSession.price,
      status: selectedSession.status,
    };
  }, [selectedSession]);

  if (!profile) return null;

  return (
    <>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <HomeHeader />

        <View style={styles.sectionsWrap}>
          {isLoading ? (
            <DashboardSection title="Next Session">
              <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
            </DashboardSection>
          ) : nextSession ? (
            <DashboardSection title="Next Session">
              <NextSessionCard
                sport={nextSession.sport}
                mentorName={nextSession.mentor_name ?? 'Mentor TBD'}
                whenLabel={formatRelativeWhen(nextSession.scheduled_at)}
                location={nextSession.location ?? 'Location TBD'}
                price={nextSession.price != null ? `$${nextSession.price}` : 'TBD'}
                color={SPORT_COLORS[nextSession.sport] ?? colors.primary}
                onPress={() => setSelectedSession(nextSession)}
              />
            </DashboardSection>
          ) : null}

          <DashboardSection title="Upcoming Events">
            {isLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
            ) : !nextSession ? (
              <View style={styles.emptyCard}>
                <Ionicons name="calendar-outline" size={26} color={colors.textSecondary} />
                <Text style={styles.emptyText}>
                  Nothing booked yet. Head to Explore to find a mentor and schedule a session.
                </Text>
              </View>
            ) : upcomingEvents.length > 0 ? (
              <EventGrid events={upcomingEvents} />
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="checkmark-circle-outline" size={26} color={colors.textSecondary} />
                <Text style={styles.emptyText}>
                  Nothing else on the horizon yet — your next session is above.
                </Text>
              </View>
            )}
          </DashboardSection>

          <DashboardSection title="Calendar">
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
                  <SessionRow
                    key={s.id}
                    sport={s.sport}
                    mentorName={s.mentor_name ?? 'Mentor TBD'}
                    subtitle={formatEventTime(s.scheduled_at)}
                    price={s.price != null ? `$${s.price}` : 'TBD'}
                    color={SPORT_COLORS[s.sport] ?? colors.primary}
                    onPress={() => setSelectedSession(s)}
                  />
                ))}
              </View>
            )}
          </DashboardSection>

          <DashboardSection title="Recent Sessions">
            {isLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 8 }} />
            ) : (
              <RecentSessionsList sessions={recentSessions} onSelectSession={findSessionById} />
            )}
          </DashboardSection>

          <DashboardSection title="Recommended Mentors">
            <RecommendedMentors
              mentors={recommendedMentors}
              isLoading={isLoadingMentors}
              onSelectMentor={setSelectedMentor}
            />
          </DashboardSection>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <SessionDetailSheet
        session={selectedSessionDetail}
        visible={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        onCancelled={loadSessions}
      />

      <MentorPreview
        mentor={selectedMentor}
        visible={selectedMentor !== null}
        onClose={() => setSelectedMentor(null)}
        onViewProfile={() => setSelectedMentor(null)}
      />
    </>
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
  sectionsWrap: {
    paddingHorizontal: spacing.lg,
  },
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
    borderRadius: 16,
    marginTop: 14,
    paddingTop: 16,
    overflow: 'hidden',
  },
  selectedDayTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 18,
    marginBottom: 4,
  },
});