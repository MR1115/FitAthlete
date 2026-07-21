import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';

export default function BookingsScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Bookings</Text>
    </ScrollView>
  );
}