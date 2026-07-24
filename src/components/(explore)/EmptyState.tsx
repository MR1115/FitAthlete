import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onClearFilters: () => void;
};

export default function EmptyState({
  onClearFilters,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={60}
        color={colors.textSecondary}
      />

      <Text style={styles.title}>
        No mentors found
      </Text>

      <Text style={styles.subtitle}>
        Try changing your search or filters.
      </Text>

      <Pressable
        style={styles.button}
        onPress={onClearFilters}
      >
        <Text style={styles.buttonText}>
          Clear Filters
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: 24,
  },

  title: {
    marginTop: 20,
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },

  button: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: colors.background,
    fontWeight: '600',
  },
});