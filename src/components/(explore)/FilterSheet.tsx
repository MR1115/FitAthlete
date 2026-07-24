import { SPORTS } from '@/constants/sports';
import { colors } from '@/styles/global';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
  visible: boolean;
  selectedSports: string[];
  onToggleSport: (sport: string) => void;
  onClose: () => void;
  onClear: () => void;
};

export default function FilterSheet({
  visible,
  selectedSports,
  onToggleSport,
  onClose,
  onClear,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>

            <Pressable onPress={onClose}>
              <Text style={styles.done}>Done</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>
            Sports
          </Text>

          <ScrollView
            contentContainerStyle={styles.chips}
          >
            {SPORTS.map((sport) => {
              const active = selectedSports.includes(sport);

              return (
                <Pressable
                  key={sport}
                  onPress={() => onToggleSport(sport)}
                  style={[
                    styles.chip,
                    active && styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.activeChipText,
                    ]}
                  >
                    {sport}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            style={styles.clearButton}
            onPress={onClear}
          >
            <Text style={styles.clearText}>
              Clear Filters
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
    maxHeight: '70%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },

  done: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 14,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },

  activeChip: {
    backgroundColor: colors.primary,
  },

  chipText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },

  activeChipText: {
    color: colors.background,
    fontWeight: '700',
  },

  clearButton: {
    marginTop: 28,
    alignItems: 'center',
  },

  clearText: {
    color: colors.alert,
    fontWeight: '600',
    fontSize: 15,
  },
});