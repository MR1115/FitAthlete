import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

// This layout is automatically applied to every screen in the auth folder.
// It creates a Stack navigator so users can move between authentication
// screens (e.g., Login and Sign Up) while hiding the default header.