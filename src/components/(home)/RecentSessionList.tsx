import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';
import SessionRow from './SessionRow';

export interface RecentSession {
  id: string;
  sport: string;
  mentorName: string;
  dateLabel: string;
  price: string;
  color?: string;
  statusLabel?: string;
}

type Props = {
  sessions: RecentSession[];
  onSelectSession: (id: string) => void;
};

export default function RecentSessionsList({ sessions, onSelectSession }: Props) {
  if (sessions.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          Completed sessions will show up here once you've had your first practice.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {sessions.map((session) => (
        <SessionRow
          key={session.id}
          sport={session.sport}
          mentorName={session.mentorName}
          subtitle={session.dateLabel}
          price={session.price}
          color={session.color}
          statusLabel={session.statusLabel}
          onPress={() => onSelectSession(session.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});