import { Redirect } from 'expo-router';

export default function AuthIndex() {
  return <Redirect href="../login" />;
}

// This file serves as the default route for the authentication section.
// If a user navigates to the auth folder without specifying a page,
// they are automatically redirected to the login screen.