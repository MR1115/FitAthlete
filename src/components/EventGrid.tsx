import { StyleSheet, View } from 'react-native';
import EventCard from './EventCard';

export default function EventGrid() {
  return (
    <View style={styles.grid}>
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
      <EventCard sport='Wrestling' mentor='John Smith' date='October 15, 2023' time='10:00 AM' location='Caruso Complex' price='$50' color='#132b61' />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    height: 200,
    marginLeft: 22,
  },
});