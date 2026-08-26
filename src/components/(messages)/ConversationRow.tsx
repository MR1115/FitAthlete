import { colors } from '@/styles/global';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from '../(profile)/Avatar';

type Props = {
  name: string;
  avatarUrl: string | null;
  preview: string | null;
  timeLabel: string;
  unreadCount: number;
  onPress: () => void;
};

export default function ConversationRow({
  name,
  avatarUrl,
  preview,
  timeLabel,
  unreadCount,
  onPress,
}: Props) {
  const hasUnread = unreadCount > 0;

  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onPress}>
      <Avatar uri={avatarUrl} name={name} size={54} />

      <View style={styles.textWrap}>
        <View style={styles.topLine}>
          <Text style={[styles.name, hasUnread && styles.nameUnread]} numberOfLines={1}>
            {name}
          </Text>
          {!!timeLabel && (
            <Text style={[styles.time, hasUnread && styles.timeUnread]}>{timeLabel}</Text>
          )}
        </View>

        <View style={styles.bottomLine}>
          <Text style={[styles.preview, hasUnread && styles.previewUnread]} numberOfLines={1}>
            {preview ?? 'Say hello 👋'}
          </Text>

          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#404050',
  },
  pressed: {
    opacity: 0.7,
  },
  textWrap: {
    flex: 1,
    marginLeft: 14,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  nameUnread: {
    fontWeight: '800',
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 8,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '700',
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '700',
  },
});