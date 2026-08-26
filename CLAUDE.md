# AGENT.md

## Project: FitAthlete

FitAthlete is a React Native mobile application built with Expo and Expo Router. The project is intended to connect athletes/parents with mentors and support discovering, booking, messaging, and managing athletic training sessions.

This file is the project-level guidance for AI coding agents working in the FitAthlete repository.

---

## 1. Core Technology

- React Native
- Expo
- Expo Router
- TypeScript
- Supabase for authentication and application data
- `@expo/vector-icons` / Ionicons for icons
- React Native `StyleSheet` for styling
- Path alias imports using `@/`

Use the existing project architecture and dependencies whenever possible. Do not introduce a new framework or state-management library unless the task genuinely requires it.

---

## 2. Application Structure

The current navigation structure uses Expo Router.

### Root navigation

The root layout uses a stack navigator with the tab group as the primary application area.

### Main tabs

The application currently has five primary tabs:

1. Home
2. Explore
3. Bookings
4. Messages
5. Profile

The tab layout hides the default header and uses the project's shared colors for the tab bar.

Do not rename, remove, or substantially reorganize these routes unless the task explicitly requires it.

---

## 3. Existing UI Architecture

The Home screen currently composes reusable components rather than putting all UI directly in the route file.

Current Home components include:

- `HomeHeader`
- `EventGrid`
- `Calendar`

The Home route also uses the shared `globalStyles`.

Prefer reusable components for UI that appears in multiple places or has meaningful independent behavior.

Avoid creating unnecessarily large route files.

---

## 4. Styling

Shared styling is defined in the project's global styles module.

Current shared colors include:

- `background`
- `header`
- `surface`
- `primary`
- `text`
- `textSecondary`
- `alert`

Use the existing `colors` and `globalStyles` when appropriate.

Before adding new colors, spacing values, typography, or repeated styling patterns, check whether an existing shared style can be reused.

Do not replace the existing visual system with a different styling framework without explicit instruction.

---

## 5. Imports

Use the existing `@/` path alias for project-local imports where it is already supported.

Examples:

```ts
import { colors } from '@/styles/global';
import { globalStyles } from '@/styles/global';