import { colors } from '@/styles/global';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Mentor } from '../(explore)/MentorCard';
import RecommendedMentorCard from './RecommendedMentorCard';

type Props = {
  mentors: Mentor[];
  isLoading: boolean;
  onSelectMentor: (mentor: Mentor) => void;
};

export default function RecommendedMentors({ mentors, isLoading, onSelectMentor }: Props) {
  if (isLoading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (mentors.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          We don't have a personalized match yet — browse all mentors to find the right fit.
        </Text>
        <Pressable style={styles.browseButton} onPress={() => router.push('/explore')}>
          <Text style={styles.browseButtonText}>Browse All Mentors</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {mentors.map((mentor) => (
        <RecommendedMentorCard
          key={mentor.profile_id}
          mentor={mentor}
          onPress={() => onSelectMentor(mentor)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 8,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 30,
    alignItems: 'center',
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
  browseButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
});