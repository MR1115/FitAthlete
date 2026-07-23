import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

// AsyncStorage's web build reaches for `window.localStorage` directly.
// That's fine once the app is running in a browser, but Expo Router
// also runs this file on the server (Node.js) to pre-render the web
// app, where `window` doesn't exist. This adapter no-ops during that
// pass instead of crashing, then behaves normally once hydrated client-side.
const webStorage = {
  getItem: (key: string) =>
    Promise.resolve(typeof window === 'undefined' ? null : window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
    return Promise.resolve()
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key)
    return Promise.resolve()
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: (Platform.OS === 'web' ? webStorage : AsyncStorage) as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})