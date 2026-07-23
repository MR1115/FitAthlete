import { useAuth } from '@/context/AuthContext';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  return (
    <ScrollView style={globalStyles.container}>

      <View style={styles.card}>
        <Text style={styles.name}>{profile?.full_name}</Text>
        <Text style={styles.accountType}>{profile?.account_type === 'mentor' ? 'Mentor' : 'Parent / Athlete'}</Text>
        {profile?.city && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detail}>{profile.city}</Text>
          </View>
        )}
        {profile?.email && (
          <View style={styles.row}>
            <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detail}>{profile.email}</Text>
          </View>
        )}
        {/* {profile?.phone && (
          <View style={styles.row}>
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detail}>{profile.phone}</Text>
          </View>
        )} */}
      </View>

      <Text style={styles.note}>Editing your details is coming soon.</Text>

      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.alert} />
        <Text style={styles.signOutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginHorizontal: 24,
  },
  name: { color: colors.text, fontSize: 18, fontWeight: '700' },
  accountType: { color: colors.primary, fontSize: 12, fontWeight: '600', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  detail: { color: colors.textSecondary, fontSize: 14 },
  note: {
    color: colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 20,
    marginHorizontal: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.alert,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 30,
    marginHorizontal: 24,
    marginBottom: 40,
  },
  signOutText: { color: colors.alert, fontWeight: '600', fontSize: 14 },
});