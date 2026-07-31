import MentorCard, { type Mentor } from '@/components/(explore)/MentorCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import SessionDetailsForm from './SessionDetailsForm';

export interface BookableMentor extends Mentor {
  default_location: string | null;
}

type MentorPickerRow = {
  profile_id: string;
  sports: string[];
  hourly_rate: number | null;
  years_experience: number | null;
  default_location: string | null;
  profiles: {
    full_name: string;
    city: string | null;
    state: string | null;
    avatar_url: string | null;
  } | null;
};

function mapMentorRow(row: MentorPickerRow): BookableMentor {
  return {
    profile_id: row.profile_id,
    full_name: row.profiles?.full_name ?? '',
    city: row.profiles?.city ?? null,
    state: row.profiles?.state ?? null,
    avatar_url: row.profiles?.avatar_url ?? null,
    sports: row.sports ?? [],
    hourly_rate: row.hourly_rate,
    years_experience: row.years_experience,
    default_location: row.default_location ?? null,
  };
}

const MENTOR_SELECT = `
  profile_id,
  sports,
  hourly_rate,
  years_experience,
  default_location,
  profiles (
    full_name,
    city,
    state,
    avatar_url
  )
`;

export default function BookSession() {
  const { profile } = useAuth();
  const params = useLocalSearchParams<{ mentorId?: string | string[] }>();
  const preselectedMentorId = Array.isArray(params.mentorId) ? params.mentorId[0] : params.mentorId;

  const [mentor, setMentor] = useState<BookableMentor | null>(null);
  const [step, setStep] = useState<'mentor' | 'details'>(preselectedMentorId ? 'details' : 'mentor');
  const [isLoadingMentor, setIsLoadingMentor] = useState(!!preselectedMentorId);
  const [mentorFetchError, setMentorFetchError] = useState<string | null>(null);

  const [mentorList, setMentorList] = useState<BookableMentor[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!preselectedMentorId) return;
    let cancelled = false;
    (async () => {
      setIsLoadingMentor(true);
      setMentorFetchError(null);
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select(MENTOR_SELECT)
        .eq('profile_id', preselectedMentorId)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setMentorFetchError("We couldn't load that mentor. Try picking one from the list instead.");
        setIsLoadingMentor(false);
        return;
      }
      setMentor(mapMentorRow(data as unknown as MentorPickerRow));
      setIsLoadingMentor(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [preselectedMentorId]);

  useEffect(() => {
    if (preselectedMentorId) return;
    let cancelled = false;
    (async () => {
      setIsLoadingList(true);
      const { data } = await supabase.from('mentor_profiles').select(MENTOR_SELECT);
      if (cancelled) return;
      setMentorList((data as unknown as MentorPickerRow[] | null)?.map(mapMentorRow) ?? []);
      setIsLoadingList(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [preselectedMentorId]);

  const filteredMentorList = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mentorList;
    return mentorList.filter(
      (m) =>
        m.full_name.toLowerCase().includes(query) ||
        m.city?.toLowerCase().includes(query) ||
        m.sports.some((s) => s.toLowerCase().includes(query))
    );
  }, [mentorList, search]);

  if (!profile) return null;

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/bookings')}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === 'mentor' ? 'Choose a Mentor' : 'Book a Session'}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      {step === 'mentor' ? (
        <>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, sport, or city"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="search"
            />
          </View>

          {isLoadingList ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : filteredMentorList.length === 0 ? (
            <Text style={styles.emptyText}>No mentors match your search.</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
              {filteredMentorList.map((m) => (
                <MentorCard
                  key={m.profile_id}
                  mentor={m}
                  onPress={() => {
                    setMentor(m);
                    setStep('details');
                  }}
                />
              ))}
            </ScrollView>
          )}
        </>
      ) : isLoadingMentor ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      ) : !mentor ? (
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>
            {mentorFetchError ?? "We couldn't load that mentor."}
          </Text>
          <Pressable style={styles.errorButton} onPress={() => setStep('mentor')}>
            <Text style={styles.errorButtonText}>Choose a Different Mentor</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SessionDetailsForm
            mentor={mentor}
            athleteProfileId={profile.id}
            onChangeMentor={() => {
              setStep('mentor');
              setMentor(null);
            }}
          />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    marginBottom: 16,
  },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
  listContent: { paddingTop: 16, paddingBottom: 40 },
  formContent: { paddingHorizontal: 20, paddingBottom: 40 },
  errorWrap: { paddingHorizontal: 24, marginTop: 40, alignItems: 'center' },
  errorText: { color: colors.textSecondary, textAlign: 'center', marginBottom: 20, fontSize: 14, lineHeight: 20 },
  errorButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorButtonText: { color: colors.background, fontWeight: '600' },
});