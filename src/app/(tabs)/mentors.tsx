import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';

export default function MentorsScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Mentors</Text>
    </ScrollView>
  );
}