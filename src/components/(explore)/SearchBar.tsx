import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
};

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
}: Props) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search mentors, sports, or cities..."
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
      />

      <Pressable
        style={({ pressed }) => [
          styles.filterButton,
          pressed && styles.pressed,
        ]}
        onPress={onFilterPress}
      >
        <Ionicons
          name="options-outline"
          size={22}
          color={colors.primary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 52,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  filterButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  pressed: {
    opacity: 0.6,
  },
});