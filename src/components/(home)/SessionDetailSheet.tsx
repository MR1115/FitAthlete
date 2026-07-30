import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import type { SessionStatus } from '@/types/index';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export interface SessionDetail {
  id: string;
  sport: string;
  mentorName: string;
  scheduledAt: string;
  location: string | null;
  price: number | null;
  status: SessionStatus;
}

type Props = {
  session: SessionDetail | null;
  visible: boolean;
  onClose: () => void;
  onCancelled: () => void;
};

export default function SessionDetailSheet({ session, visible, onClose, onCancelled }: Props) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfirmingCancel(false);
    setError(null);
    setIsCancelling(false);
  }, [session?.id, visible]);

  if (!session) return null;

  const scheduledDate = new Date(session.scheduledAt);
  const isPast = scheduledDate.getTime() < Date.now();
  const isCancellable = session.status === 'scheduled' && !isPast;

  const dateLabel = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLabel = scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  async function handleConfirmCancel() {
    if (!session) return;
    setIsCancelling(true);
    setError(null);

    const { error: cancelError } = await supabase
      .from('sessions')
      .update({ status: 'cancelled' })
      .eq('id', session.id);

    setIsCancelling(false);

    if (cancelError) {
      setError(cancelError.message);
      return;
    }

    onCancelled();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <Text style={styles.sport}>{session.sport}</Text>
          <Text style={styles.mentor}>with {session.mentorName}</Text>

          {isPast && (
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Completed</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.detailText}>{dateLabel}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={styles.detailText}>{timeLabel}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.detailText}>{session.location ?? 'Location TBD'}</Text>
          </View>

          {session.price != null && (
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color={colors.primary} />
              <Text style={styles.detailText}>${session.price}/session</Text>
            </View>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          {isCancellable &&
            (confirmingCancel ? (
              <View style={styles.confirmBlock}>
                <Text style={styles.confirmText}>
                  Cancel this session with {session.mentorName}?
                </Text>
                <View style={styles.confirmRow}>
                  <Pressable
                    style={[styles.confirmButton, styles.keepButton]}
                    onPress={() => setConfirmingCancel(false)}
                    disabled={isCancelling}
                  >
                    <Text style={styles.keepButtonText}>Keep Session</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.confirmButton, styles.cancelConfirmButton]}
                    onPress={handleConfirmCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <ActivityIndicator color={colors.background} />
                    ) : (
                      <Text style={styles.cancelConfirmButtonText}>Yes, Cancel</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable style={styles.cancelButton} onPress={() => setConfirmingCancel(true)}>
                <Text style={styles.cancelButtonText}>Cancel Session</Text>
              </Pressable>
            ))}

          <Pressable style={styles.messageButton} disabled>
            <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.messageButtonText}>Messaging Coming Soon</Text>
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
  sport: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  mentor: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(79, 195, 247, 0.14)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 12,
  },
  statusPillText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  detailText: {
    color: colors.text,
    fontSize: 15,
  },
  error: {
    color: colors.alert,
    fontSize: 13,
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.alert,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.alert,
    fontWeight: '700',
    fontSize: 15,
  },
  confirmBlock: {
    marginTop: 24,
  },
  confirmText: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepButton: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  keepButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  cancelConfirmButton: {
    backgroundColor: colors.alert,
  },
  cancelConfirmButtonText: {
    color: colors.background,
    fontWeight: '700',
  },
  messageButton: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(70,70,70,0.15)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  messageButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
});