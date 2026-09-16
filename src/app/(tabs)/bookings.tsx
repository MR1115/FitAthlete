import RecentSessionsList, { type RecentSession } from '@/components/(home)/RecentSessionList';
import SessionDetailSheet, { type SessionDetail } from '@/components/(home)/SessionDetailSheet';
import { SPORT_COLORS } from '@/constants/sportColors';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, globalStyles } from '@/styles/global';
import type { SessionEvent } from '@/types/index';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface SessionWithMentor extends SessionEvent {
  mentor_name: string | null;
}

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const TABS = ['upcoming', 'past', 'cancelled'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  upcoming: 'Upcoming',
  past: 'Past',
  cancelled: 'Cancelled',
};

const EMPTY_MESSAGES: Record<Tab, string> = {
  upcoming: 'Nothing on the calendar yet. Tap "Book a Session" above to get started.',
  past: 'Sessions you complete will show up here.',
  cancelled: "Sessions you cancel will show up here.",
};

export default function BookingsScreen() {
  const { profile } = useAuth();

  if (profile?.account_type === 'mentor') {
    return <MentorBookingsPlaceholder />;
  }

  return <AthleteBookings />;
}

function MentorBookingsPlaceholder() {
  return (
    <View style={[globalStyles.container, styles.centerContent]}>
      <Ionicons name="briefcase-outline" size={40} color={colors.textSecondary} />
      <Text style={[globalStyles.title, styles.placeholderTitle]}>Booking Requests</Text>
      <Text style={styles.placeholderBody}>
        Managing incoming booking requests and your schedule is coming next.
      </Text>
    </View>
  );
}

function AthleteBookings() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<SessionWithMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [selectedSession, setSelectedSession] = useState<SessionWithMentor | null>(null);

  const loadSessions = useCallback(async () => {
    if (!profile) return;
    // Unlike Home, Bookings is the definitive history — it intentionally
    // does NOT exclude cancelled sessions, since those get their own tab.
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentor:mentor_profile_id ( full_name )')
      .eq('athlete_profile_id', profile.id)
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

  async function handleRefresh() {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  }

  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => s.status !== 'cancelled' && new Date(s.scheduled_at).getTime() >= Date.now())
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()),
    [sessions]
  );

  const past = useMemo(
    () =>
      sessions
        .filter((s) => s.status !== 'cancelled' && new Date(s.scheduled_at).getTime() < Date.now())
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()),
    [sessions]
  );

  const cancelled = useMemo(
    () =>
      sessions
        .filter((s) => s.status === 'cancelled')
        .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()),
    [sessions]
  );

  const listsByTab: Record<Tab, SessionWithMentor[]> = { upcoming, past, cancelled };

  function toRow(s: SessionWithMentor): RecentSession {
    return {
      id: s.id,
      sport: s.sport,
      mentorName: s.mentor_name ?? 'Mentor TBD',
      dateLabel: `${formatEventDate(s.scheduled_at)} · ${formatEventTime(s.scheduled_at)}`,
      price: s.price != null ? `$${s.price}` : 'TBD',
      color: SPORT_COLORS[s.sport] ?? colors.primary,
      statusLabel:
        activeTab === 'past' ? 'Completed' : activeTab === 'cancelled' ? 'Cancelled' : undefined,
    };
  }

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
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <Text style={globalStyles.title}>Bookings</Text>

        <View style={styles.actionWrap}>
          <Pressable style={styles.bookButton} onPress={() => router.push('../book-session')}>
            <Ionicons name="add-circle-outline" size={20} color={colors.background} />
            <Text style={styles.bookButtonText}>Book a Session</Text>
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {TAB_LABELS[tab]} ({listsByTab[tab].length})
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.listWrap}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <RecentSessionsList
              sessions={listsByTab[activeTab].map(toRow)}
              onSelectSession={findSessionById}
              emptyMessage={EMPTY_MESSAGES[activeTab]}
            />
          )}
        </View>
      </ScrollView>

      <SessionDetailSheet
        session={selectedSessionDetail}
        visible={selectedSession !== null}
        onClose={() => setSelectedSession(null)}
        onCancelled={loadSessions}
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
  content: { paddingBottom: 40 },
  actionWrap: { paddingHorizontal: 24, marginTop: 20 },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookButtonText: { color: colors.background, fontWeight: '700', fontSize: 16 },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabButtonActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: colors.background },
  listWrap: { paddingHorizontal: 24, marginTop: 20 },
});