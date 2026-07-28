import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ProfileSection({
  title,
  children,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title.toUpperCase()}
      </Text>

      <View style={styles.card}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginHorizontal: 20,
  },

  title: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 1,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
});