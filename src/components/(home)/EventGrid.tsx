import { StyleSheet, View } from 'react-native';
import EventCard from './EventCard';

export interface UpcomingEvent {
  id: string;
  sport: string;
  mentor: string;
  date: string;
  time: string;
  location: string;
  price: string;
  color?: string;
}

export default function EventGrid({ events }: { events: UpcomingEvent[] }) {
  return (
    <View style={styles.grid}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          sport={event.sport}
          mentor={event.mentor}
          date={event.date}
          time={event.time}
          location={event.location}
          price={event.price}
          color={event.color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});