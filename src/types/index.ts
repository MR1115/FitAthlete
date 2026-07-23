export type AccountType = 'athlete' | 'mentor';

export interface Profile {
  id: string;
  account_type: AccountType;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteProfile {
  profile_id: string;
  managed_by_parent: boolean;
  athlete_name: string | null;
  athlete_age: number | null;
  sports: string[];
  skill_level: string | null;
  goals: string | null;
}

export interface MentorProfile {
  profile_id: string;
  bio: string | null;
  sports: string[];
  years_experience: number | null;
  hourly_rate: number | null;
  default_location: string & string | null;
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface SessionEvent {
  id: string;
  athlete_profile_id: string;
  mentor_profile_id: string | null;
  sport: string;
  scheduled_at: string;
  duration_minutes: number;
  location: string | null;
  price: number | null;
  status: SessionStatus;
  created_at: string;
}