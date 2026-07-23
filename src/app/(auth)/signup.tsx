import { supabase } from '@/lib/supabase';
import { colors, globalStyles } from '@/styles/global';
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

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkEmailNotice, setCheckEmailNotice] = useState(false);

  async function handleEmailSignup() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    const { error: signUpError, data } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.session === null) {
      setCheckEmailNotice(true);
    }
  }

  if (checkEmailNotice) {
    return (
      <View style={[globalStyles.container, styles.centerContent]}>
        <Text style={styles.brand}>Check your email</Text>
        <Text style={styles.checkEmailBody}>
          We sent a confirmation link to {email}. Tap it, then come back and log in.
        </Text>
        <Link href="../login" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Back to Log In</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.brand}>Create your account</Text>
          <Text style={styles.subtitle}>
            You'll pick Parent/Athlete or Mentor on the next screen.
          </Text>

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
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleEmailSignup}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Text>
            </Pressable>
          </View>

          <Link href="../login" asChild>
            <Pressable style={styles.linkWrap}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingVertical: 40 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: 26, fontWeight: 'bold', color: colors.text, textAlign: 'center' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 8, marginBottom: 24 },
  checkEmailBody: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
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
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPressed: { opacity: 0.85 },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '600' },
  linkWrap: { marginTop: 24, alignItems: 'center' },
  link: { color: colors.primary, fontSize: 14 },
});