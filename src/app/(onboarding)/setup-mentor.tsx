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

export default function SetupMentorScreen() {
  const { session, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
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
    if (selectedSports.length === 0) {
      setError('Pick at least one sport you coach.');
      return;
    }

    setIsSubmitting(true);

    const { error: profileError } = await supabase.from('profiles').insert({
      id: session.user.id,
      account_type: 'mentor',
      full_name: fullName.trim(),
      email: session.user.email ?? null,
      phone: session.user.phone ?? null,
      city: city.trim() || null,
      state: state.trim() || null,
    });

    if (profileError) {
      setIsSubmitting(false);
      setError(profileError.message);
      return;
    }

    const { error: mentorError } = await supabase.from('mentor_profiles').insert({
      profile_id: session.user.id,
      bio: bio.trim() || null,
      sports: selectedSports,
      years_experience: yearsExperience.trim() ? Number(yearsExperience.trim()) : null,
      hourly_rate: hourlyRate.trim() ? Number(hourlyRate.trim()) : null,
      default_location: city.trim() && state.trim() ? `${city.trim()}, ${state.trim()}` : null,
    });

    setIsSubmitting(false);

    if (mentorError) {
      setError(mentorError.message);
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
        <Text style={styles.title}>Set up your mentor profile</Text>
        <Text style={styles.subtitle}>
          This is what athletes and parents will see when they find you.
        </Text>

        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell athletes about your coaching style and experience"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="What city you're based in"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="What state you're based in"
          placeholderTextColor={colors.textSecondary}
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              value={yearsExperience}
              onChangeText={setYearsExperience}
              placeholder="e.g. 5"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Rate per Session ($)</Text>
            <TextInput
              style={styles.input}
              value={hourlyRate}
              onChangeText={setHourlyRate}
              placeholder="e.g. 60"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Sports You Coach</Text>
        <View style={styles.chipRow}>
          {SPORTS.map((sport) => (
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
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 50 },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8, marginBottom: 24 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 8, marginTop: 18 },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 12 },
  rowItem: { flex: 1 },
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