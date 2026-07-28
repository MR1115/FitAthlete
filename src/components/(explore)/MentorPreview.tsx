import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Avatar from '../(profile)/Avatar';

export type MentorPreview = {
  profile_id: string;
  full_name: string;
  city: string | null;
  state: string | null;
  sports: string[];
  hourly_rate: number | null;
  years_experience: number | null;
  bio?: string | null;
  avatar_url: string | null;
};

type Props = {
  mentor: MentorPreview | null;
  visible: boolean;
  onClose: () => void;
  onViewProfile: () => void;
};

export default function MentorPreview({
  mentor,
  visible,
  onClose,
  onViewProfile,
}: Props) {
  if (!mentor) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={styles.sheet}
          onPress={() => {}}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.avatar}>
              <Avatar
                uri={mentor.avatar_url}
                name={mentor.full_name}
                size={64}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {mentor.full_name}
              </Text>

              <Text style={styles.sports}>
                {mentor.sports.join(' • ')}
              </Text>
            </View>
          </View>

          <View style={styles.stats}>

            <View style={styles.stat}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.primary}
              />

              <Text style={styles.statText}>
                {mentor.city}
                {mentor.state ? `, ${mentor.state}` : ''}
              </Text>
            </View>

            {mentor.hourly_rate != null && (
              <View style={styles.stat}>
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={colors.primary}
                />

                <Text style={styles.statText}>
                  ${mentor.hourly_rate}/session
                </Text>
              </View>
            )}

            {mentor.years_experience != null && (
              <View style={styles.stat}>
                <Ionicons
                  name="trophy-outline"
                  size={16}
                  color={colors.primary}
                />

                <Text style={styles.statText}>
                  {mentor.years_experience} years coaching
                </Text>
              </View>
            )}

          </View>

          <Text style={styles.section}>
            About
          </Text>

          <ScrollView
            style={{ maxHeight: 110 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.bio}>
              {mentor.bio?.trim()
                ? mentor.bio
                : 'This mentor has not written a bio yet.'}
            </Text>
          </ScrollView>
          
          {/** View Profile Button*/}
          <Pressable
            style={styles.profileButton}
            onPress={onViewProfile}
          >
            <Text style={styles.profileButtonText}>
              View Full Profile
            </Text>
          </Pressable>
          
          {/** Messaging Button */}
          <Pressable
            style={styles.disabledButton}
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={colors.textSecondary}
            />

            <Text style={styles.disabledText}>
              Messaging Coming Soon
            </Text>
          </Pressable>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },

  handle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    alignSelf: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },

  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },

  sports: {
    color: colors.primary,
    marginTop: 6,
  },

  stats: {
    marginTop: 24,
    gap: 14,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statText: {
    color: colors.textSecondary,
    marginLeft: 8,
  },

  section: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 10,
    fontSize: 18,
  },

  bio: {
    color: colors.textSecondary,
    lineHeight: 22,
  },

  profileButton: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },

  profileButtonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 16,
  },

  disabledButton: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  disabledText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});