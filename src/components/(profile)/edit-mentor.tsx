import { SPORTS } from '@/constants/sports';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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

type MentorProfile = {
  bio: string | null;
  sports: string[] | null;
  years_experience: number | null;
  hourly_rate: number | null;
  default_location: string | null;
};

export default function EditMentorScreen() {
  const { profile, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [defaultLocation, setDefaultLocation] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    loadMentorProfile();
  }, []);

  async function loadMentorProfile() {
    if (!profile) return;

    const { data, error } = await supabase
      .from('mentor_profiles')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    if (!error && data) {
      const mentor = data as MentorProfile;

      setBio(mentor.bio ?? '');
      setSports(mentor.sports ?? []);
      setYearsExperience(
        mentor.years_experience
          ? mentor.years_experience.toString()
          : ''
      );

      setHourlyRate(
        mentor.hourly_rate
          ? mentor.hourly_rate.toString()
          : ''
      );

      setDefaultLocation(
        mentor.default_location ?? ''
      );
    }

    setLoading(false);
  }

  function toggleSport(sport: string) {
    if (sports.includes(sport)) {
      setSports(
        sports.filter((s) => s !== sport)
      );
    } else {
      setSports([...sports, sport]);
    }
  }

  async function handleSave() {
    if (!profile) return;

    setError('');

    if (sports.length === 0) {
      setError('Please choose at least one sport.');
      return;
    }

    setSaving(true);

    const { error: updateError } = await supabase
      .from('mentor_profiles')
      .update({
        bio: bio.trim() || null,
        sports,
        years_experience: yearsExperience
          ? Number(yearsExperience)
          : null,
        hourly_rate: hourlyRate
          ? Number(hourlyRate)
          : null,
        default_location:
          defaultLocation.trim() || null,
      })
      .eq('profile_id', profile.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await refreshProfile();

    router.back();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.title}>
            Edit Mentor Profile
          </Text>

          <View style={{ width: 26 }} />
        </View>

        <Text style={styles.label}>
          Bio
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.bioInput,
          ]}
          multiline
          value={bio}
          onChangeText={setBio}
          placeholder="Tell athletes about yourself..."
          placeholderTextColor={
            colors.textSecondary
          }
        />

        <Text style={styles.label}>
          Sports
        </Text>

        <View style={styles.chipContainer}>
          {SPORTS.map((sport) => {
            const selected =
              sports.includes(sport);

            return (
              <Pressable
                key={sport}
                onPress={() =>
                  toggleSport(sport)
                }
                style={[
                  styles.chip,
                  selected &&
                    styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected &&
                      styles.chipTextSelected,
                  ]}
                >
                  {sport}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>
          Years of Experience
        </Text>

        <TextInput
          style={styles.input}
          value={yearsExperience}
          onChangeText={
            setYearsExperience
          }
          keyboardType="number-pad"
          placeholder="8"
          placeholderTextColor={
            colors.textSecondary
          }
        />

        <Text style={styles.label}>
          Hourly Rate ($)
        </Text>

        <TextInput
          style={styles.input}
          value={hourlyRate}
          onChangeText={setHourlyRate}
          keyboardType="decimal-pad"
          placeholder="60"
          placeholderTextColor={
            colors.textSecondary
          }
        />

        <Text style={styles.label}>
          Default Location
        </Text>

        <TextInput
          style={styles.input}
          value={defaultLocation}
          onChangeText={
            setDefaultLocation
          }
          placeholder="Chicago, IL"
          placeholderTextColor={
            colors.textSecondary
          }
        />

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color={colors.background}
            />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Changes
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },

  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  bioInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },

  chip: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  chipSelected: {
    backgroundColor: colors.primary,
  },

  chipText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  chipTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },

  error: {
    color: colors.alert,
    fontSize: 14,
    marginTop: 18,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },

  cancelButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 12,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  cancelButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});