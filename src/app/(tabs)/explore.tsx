import { globalStyles } from '@/styles/global';
import { ScrollView, Text } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Explore</Text>
    </ScrollView>
  );
}