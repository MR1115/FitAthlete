import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>FitAthlete</Text>
      <Text style={styles.tagline}>Building 1% Better Athletes Each Day.</Text>
      <Text style={styles.date}>{currentDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginLeft: 24, marginTop: 24, marginBottom: 8 },
  brand: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  tagline: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, marginTop: 4 },
  date: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
});