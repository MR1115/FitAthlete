import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View>
      <View style={globalStyles.header}>
        <View>
          <Text style={globalStyles.title}>FitAthlete</Text>
          <View style={globalStyles.space}></View>
          <Text style={styles.subheader}>Building 1% Better Athletes Each Day.</Text>
        </View>
      </View>
      <View>
        <View style={globalStyles.space}></View>
        <View>
          <Text style={styles.subheader}>Upcoming Events
          <Text> </Text>
          <Ionicons name='calendar' size={24} color={colors.text} /></Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 30,
  },
  subheader: {
    alignSelf: 'auto',
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
    marginLeft: 24,
  },
});