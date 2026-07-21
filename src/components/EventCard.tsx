import { StyleSheet, Text, View } from 'react-native';

type EventCardProps = {
  sport: string;
  mentor: string;
  date: string;
  time: string;
  location: string;
  price: string;
  color: string;
};

export default function EventCard({
  sport,
  mentor,
  date,
  time,
  location,
  price,
  color,
}: EventCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.title}>{sport}</Text>
      <Text style={styles.value}>Mentor: {mentor}</Text>
      <Text style={styles.value}>Date: {date}</Text>
      <Text style={styles.value}>Time: {time}</Text>
      <Text style={styles.value}>Location: {location}</Text>
      <Text style={styles.value}>Cost: {price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#02020242',
    borderRadius: 12,
    padding: 16,
    width: '24%',
    borderLeftWidth: 12,
  },
  value: {
    fontSize: 16,
    color: '#e4e3e3',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#302f2e',
    marginTop: 4,
    marginBottom: 14,
  },
});