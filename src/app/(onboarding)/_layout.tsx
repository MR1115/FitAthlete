import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

// This layout is automatically applied to every screen in the onboarding folder.
// It creates a Stack navigator so users can move between onboarding
// screens (e.g., account-type and setup-athlete/setup-mentor) while hiding the default header.