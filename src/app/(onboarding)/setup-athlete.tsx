import { SPORTS } from '@/constants/sports';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ForWhom = 'self' | 'child';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function SetupAthleteScreen() {
  const { session, refreshProfile } = useAuth();
  const [forWhom, setForWhom] = useState<ForWhom>('self');
  const [fullName, setFullName] = useState('');
  const [athleteName, setAthleteName] = useState('');
  const [athleteAge, setAthleteAge] = useState('');
  const [city, setCity] = useState('');
  const [skillLevel, setSkillLevel] = useState<string>('Beginner');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleSport(sport: string) {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  }

  async function handleSubmit() {
    setError(null);
    if (!session) return;
    if (!fullName.trim()) {
      setError('Enter your name.');
      return;
    }
    if (forWhom === 'child' && !athleteName.trim()) {
      setError("Enter your child's name.");
      return;
    }
    if (selectedSports.length === 0) {
      setError('Pick at least one sport.');
      return;
    }

    setIsSubmitting(true);

    const { error: profileError } = await supabase.from('profiles').insert({
      id: session.user.id,
      account_type: 'athlete',
      full_name: fullName.trim(),
      email: session.user.email ?? null,
      phone: session.user.phone ?? null,
      city: city.trim() || null,
    });

    if (profileError) {
      setIsSubmitting(false);
      setError(profileError.message);
      return;
    }

    const { error: athleteError } = await supabase.from('athlete_profiles').insert({
      profile_id: session.user.id,
      managed_by_parent: forWhom === 'child',
      athlete_name: forWhom === 'child' ? athleteName.trim() : fullName.trim(),
      athlete_age: athleteAge.trim() ? Number(athleteAge.trim()) : null,
      sports: selectedSports,
      skill_level: skillLevel,
    });

    setIsSubmitting(false);

    if (athleteError) {
      setError(athleteError.message);
      return;
    }

    await refreshProfile();
    router.replace('/');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>A few quick questions and you're in.</Text>

        <Text style={styles.label}>Who is this account for?</Text>
        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.togglePill, forWhom === 'self' && styles.togglePillActive]}
            onPress={() => setForWhom('self')}
          >
            <Text style={[styles.toggleText, forWhom === 'self' && styles.toggleTextActive]}>
              Myself
            </Text>
          </Pressable>
          <Pressable
            style={[styles.togglePill, forWhom === 'child' && styles.togglePillActive]}
            onPress={() => setForWhom('child')}
          >
            <Text style={[styles.toggleText, forWhom === 'child' && styles.toggleTextActive]}>
              My Child
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          placeholderTextColor={colors.textSecondary}
        />

        {forWhom === 'child' && (
          <>
            <Text style={styles.label}>Athlete's Name</Text>
            <TextInput
              style={styles.input}
              value={athleteName}
              onChangeText={setAthleteName}
              placeholder="Your child's name"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.label}>Athlete's Age</Text>
            <TextInput
              style={styles.input}
              value={athleteAge}
              onChangeText={setAthleteAge}
              placeholder="Age"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
            />
          </>
        )}

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="So we can find mentors nearby"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Skill Level</Text>
        <View style={styles.chipRow}>
          {SKILL_LEVELS.map((level) => (
            <Pressable
              key={level}
              style={[styles.chip, skillLevel === level && styles.chipActive]}
              onPress={() => setSkillLevel(level)}
            >
              <Text style={[styles.chipText, skillLevel === level && styles.chipTextActive]}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Sports of Interest</Text>
        <View style={styles.chipRow}>
          {SPORTS.map((sport: string) => (
            <Pressable
              key={sport}
              style={[styles.chip, selectedSports.includes(sport) && styles.chipActive]}
              onPress={() => toggleSport(sport)}
            >
              <Text
                style={[styles.chipText, selectedSports.includes(sport) && styles.chipTextActive]}
              >
                {sport}
              </Text>
            </Pressable>
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Saving…' : 'Finish Setup'}</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginTop: 50 },
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8, marginBottom: 24 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 8, marginTop: 18 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  togglePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  togglePillActive: { backgroundColor: colors.primary },
  toggleText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  toggleTextActive: { color: colors.background },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: colors.background, fontWeight: '600' },
  error: { color: colors.alert, marginTop: 16, fontSize: 13 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '600' },
});