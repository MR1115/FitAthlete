import CalendarScreen from '@/components/Calendar';
import EventGrid from '@/components/EventGrid';
import HomeHeader from '@/components/HomeHeader';
import { globalStyles } from '@/styles/global';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <HomeHeader />

      <ScrollView>
        <EventGrid />
      </ScrollView>

      <View style={globalStyles.space}></View>
      <View style={globalStyles.space}></View>
      <View style={globalStyles.space}></View>
      
      <CalendarScreen />
    </ScrollView>
  );
}