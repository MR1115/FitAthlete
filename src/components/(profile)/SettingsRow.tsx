import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

export default function SettingsRow({
  icon,
  title,
  value,
  onPress,
  danger = false,
}: Props) {
  const textColor = danger ? colors.alert : colors.text;
  const iconColor = danger ? colors.alert : colors.primary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && onPress ? styles.pressed : null,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={20}
          color={iconColor}
        />

        <Text
          style={[
            styles.title,
            { color: textColor },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        {value ? (
          <Text
            style={styles.value}
            numberOfLines={1}
          >
            {value}
          </Text>
        ) : null}

        {onPress ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textSecondary}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    container: {
        height: 58,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#404050',
    },

    pressed: {
        opacity: 0.7,
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    right: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },

    title: {
        marginLeft: 14,
            fontSize: 15,
        fontWeight: '500',
        flexShrink: 1,
    },

    value: {
        color: colors.textSecondary,
        fontSize: 14,
        marginRight: 8,
        maxWidth: 150,
    },
});