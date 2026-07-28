import ProfileHeader from '@/components/(profile)/ProfileHeader';
import ProfileSection from '@/components/(profile)/ProfileSection';
import SettingsRow from '@/components/(profile)/SettingsRow';
import { useAuth } from '@/context/AuthContext';
import { globalStyles } from '@/styles/global';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  if (!profile) return null;

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        fullName={profile.full_name}
        accountType={profile.account_type}
        city={profile.city}
        state={profile.state}
        avatarUrl={profile.avatar_url}
        onEditPress={() => router.push('../edit-profile')}
      />

      {/* ---------------- Profile ---------------- */}

      <ProfileSection title="Profile">

        <SettingsRow
          icon="person-outline"
          title="Full Name"
          value={profile.full_name}
          onPress={() => router.push('../edit-profile')}
        />

        <SettingsRow
          icon="mail-outline"
          title="Email"
          value={profile.email ?? 'Not set'}
        />

        <SettingsRow
          icon="call-outline"
          title="Phone"
          value={profile.phone ?? 'Not set'}
          onPress={() => router.push('../edit-profile')}
        />

        <SettingsRow
          icon="location-outline"
          title="Location"
          value={
            profile.city
              ? `${profile.city}${profile.state ? `, ${profile.state}` : ''}`
              : 'Not set'
          }
          onPress={() => router.push('../edit-profile')}
        />

      </ProfileSection>

      {/* ---------------- Account ---------------- */}

      <ProfileSection title="Account">

        <SettingsRow
          icon="notifications-outline"
          title="Notifications"
          value="Coming Soon"
        />

        <SettingsRow
          icon="lock-closed-outline"
          title="Privacy"
          value="Coming Soon"
        />

        <SettingsRow
          icon="help-circle-outline"
          title="Help & Support"
          value="Coming Soon"
        />

        <SettingsRow
          icon="information-circle-outline"
          title="About FitAthlete"
          value="v1.0"
        />

      </ProfileSection>

      {/* ---------------- Mentor ---------------- */}

      {profile.account_type === 'mentor' && (
        <ProfileSection title="Mentor Settings">

          <SettingsRow
            icon="create-outline"
            title="Edit Mentor Profile"
            onPress={() => router.push('../edit-mentor')}
          />

          <SettingsRow
            icon="calendar-outline"
            title="Availability"
            value="Coming Soon"
          />

          <SettingsRow
            icon="cash-outline"
            title="Session Pricing"
            onPress={() => router.push('../edit-mentor')}
          />

          <SettingsRow
            icon="football-outline"
            title="Sports"
            onPress={() => router.push('../edit-mentor')}
          />

          <SettingsRow
            icon="school-outline"
            title="Experience"
            onPress={() => router.push('../edit-mentor')}
          />

          <SettingsRow
            icon="document-text-outline"
            title="Bio"
            onPress={() => router.push('../edit-mentor')}
          />
        </ProfileSection>
      )}

      {/* ---------------- Log Out ---------------- */}

      <ProfileSection title="">

        <SettingsRow
          icon="log-out-outline"
          title="Log Out"
          danger
          onPress={signOut}
        />

      </ProfileSection>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});
