// -----------------------------------------------------------------------------
// Login Screen
//
// This screen allows existing users to sign in to the FitAthlete app using
// their email address and password. User credentials are validated before
// being sent to Supabase for authentication. If the login is successful,
// the authentication system handles the user's session. If an error occurs,
// an appropriate message is displayed to the user.
// -----------------------------------------------------------------------------

import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { Link } from 'expo-router';
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

export default function LoginScreen() {
  // Stores the user's email address
  const [email, setEmail] = useState('');

  // Stores the user's password
  const [password, setPassword] = useState('');

  // Stores any login error message that should be displayed
  const [error, setError] = useState<string | null>(null);

  // Prevents multiple login attemps while authentication is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Attempts to sign the user into their account.
   *
   * First, the function checks that both the email and password have been
   * entered. If either field is missing, an error message is shown.
   *
   * If both fields are valid, the credentials are sent to Supabase for
   * authentication. Any authentication errors returned by Supabase are
   * displayed to the user.
   */
  async function handleEmailLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);
    if (signInError) setError(signInError.message);
  }

  // Displays the login form and allows users to navigate to the
  // account creation screen if they do not already have an account.
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.brand}>FitAthlete</Text>
          <Text style={styles.subtitle}>Building 1% Better Athletes Each Day.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleEmailLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Logging in…' : 'Log In'}</Text>
            </Pressable>
          </View>

          {/* Link to the account registration screen. */}
          <Link href="../signup" asChild>
            <Pressable style={styles.linkWrap}>
              <Text style={styles.link}>Don't have an account? Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles used by the login screen.
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingVertical: 40 },
  brand: { fontSize: 30, fontWeight: 'bold', color: colors.text },
  subtitle: { color: colors.textSecondary, fontSize: 15, marginTop: 8, marginBottom: 28 },
  form: { gap: 4 },
  label: { color: colors.textSecondary, fontSize: 13, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  error: { color: colors.alert, marginTop: 12, fontSize: 13 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '600' },
  linkWrap: { marginTop: 24, alignItems: 'center' },
  link: { color: colors.primary, fontSize: 14 },
});