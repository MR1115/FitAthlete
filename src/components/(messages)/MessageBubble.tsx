import { colors } from '@/styles/global';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  content: string;
  timeLabel: string;
  isMine: boolean;
};

export default function MessageBubble({ content, timeLabel, isMine }: Props) {
  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.text, isMine ? styles.textMine : styles.textTheirs]}>{content}</Text>
      </View>
      <Text style={styles.time}>{timeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    maxWidth: '78%',
    marginVertical: 3,
  },
  rowMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  rowTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#eef0f6',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  textMine: {
    color: colors.background,
  },
  textTheirs: {
    color: colors.text,
  },
  time: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    marginHorizontal: 4,
  },
});