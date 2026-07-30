import { Redirect } from 'expo-router';

export default function OnboardingIndex() {
  return <Redirect href="../account-type" />;
}

// This file serves as the default route for the onboarding section.
// If a user navigates to the onboarding folder without specifying an account type,
// they are automatically redirected to the account-type screen.