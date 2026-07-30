// Account Type Screen
// This screen lets a new user choose what type of accountthey want to create.
// Their selection determines which setup screen they are token to next.

import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Main account type selection screen (default screen)
export default function AccountTypeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FitAthlete</Text>
      <Text style={styles.subtitle}>Tell us who you are so we can set things up right.</Text>

      {/* Option for parents and athletes */}
      <Pressable style={styles.card} onPress={() => router.push('../setup-athlete')}>
        <Ionicons name="school-outline" size={32} color={colors.primary} />
        <Text style={styles.cardTitle}>I'm a Parent / Athlete</Text>
        <Text style={styles.cardBody}>
          I'm looking to book private practices with a mentor — for myself or my child.
        </Text>
      </Pressable>

      { /* Option for mentors */}
      <Pressable style={styles.card} onPress={() => router.push('../setup-mentor')}>
        <Ionicons name="ribbon-outline" size={32} color={colors.primary} />
        <Text style={styles.cardTitle}>I'm a Mentor</Text>
        <Text style={styles.cardBody}>
          I coach athletes and want to list my availability and get booked.
        </Text>
      </Pressable>

      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text>Clear Session</Text>
      </Pressable>
    </View>
  );
}

// Styles for the account-type page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.text },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginTop: 8, marginBottom: 32 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: 12 },
  cardBody: { color: colors.textSecondary, fontSize: 13, marginTop: 6, lineHeight: 18 },
});