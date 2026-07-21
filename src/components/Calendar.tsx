import { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Calendar } from "react-native-calendars";

// Get device width
const screenWidth = Dimensions.get("window").width;

// Responsive calendar size
const calendarWidth = Math.min(screenWidth * 0.82, 500);


export default function CalendarScreen() {

  const [selectedDate, setSelectedDate] = useState<string>("");


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.card}>

        <Calendar
          style={[
            styles.calendar,
            {
              width: calendarWidth - 24,
            }
          ]}

          // Select date
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}

          // Highlight selected date
          markedDates={{

            [selectedDate]: {
              selected: true,
              selectedColor: "#4CAF50",
              selectedTextColor: "white",
            },
          }}

          theme={{
            calendarBackground: "transparent",

            // Header
            monthTextColor: "#222",
            textMonthFontSize: 20,
            textMonthFontWeight: "700",
            arrowColor: "#4CAF50",

            // Week labels
            textSectionTitleColor: "#777",
            textDayHeaderFontSize: 13,

            // Days
            dayTextColor: "#222",
            textDayFontSize: 15,
            textDayFontWeight: "500",

            // Today
            todayTextColor: "#4CAF50",

            // Selected
            selectedDayBackgroundColor: "#4CAF50",
            selectedDayTextColor: "#FFFFFF",
          }}
        />

        {selectedDate.length > 0 && (
          <View style={styles.infoBox}>

            <Text style={styles.selectedText}>
              Selected Date
            </Text>

            <Text style={styles.date}>
              {selectedDate}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: calendarWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },

  calendar: {
    borderRadius: 20,
    overflow: "hidden",
  },

  infoBox: {
    marginTop: 15,
    alignItems: "center",
  },

  selectedText: {
    fontSize: 14,
    color: "#777",
  },

  date: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },
});