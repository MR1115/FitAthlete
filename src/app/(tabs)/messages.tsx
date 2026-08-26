import ConversationRow from '@/components/(messages)/ConversationRow';
import MessagePicker from '@/components/(messages)/MessagePicker';
import { useAuth } from '@/context/AuthContext';
import {
  fetchConversations,
  findOrCreateConversation,
  subscribeToConversationList,
  type ConversationListItem,
  type SearchedProfile,
} from '@/lib/messaging';
import { colors, globalStyles } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

function formatListTime(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / 86400000);

  if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > -7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function MessagesScreen() {
  const { session } = useAuth();
  const myId = session?.user.id;

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const load = useCallback(async () => {
    if (!myId) return;
    const data = await fetchConversations(myId);
    setConversations(data);
    setIsLoading(false);
  }, [myId]);

  useFocusEffect(
    useCallback(() => {
      load();
      const unsubscribe = subscribeToConversationList(load);
      return unsubscribe;
    }, [load])
  );

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function handlePickUser(picked: SearchedProfile) {
    if (!myId) return;
    setPickerVisible(false);
    await findOrCreateConversation(myId, picked.id);
    router.push(`../conversation?otherId=${picked.id}`);
  }

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>Messages</Text>
        <Pressable style={styles.newButton} onPress={() => setPickerVisible(true)} hitSlop={10}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={conversations.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyBody}>
              Tap the compose icon above to message a mentor or athlete.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ConversationRow
            name={item.otherName}
            avatarUrl={item.otherAvatarUrl}
            preview={item.lastMessagePreview}
            timeLabel={formatListTime(item.lastMessageAt)}
            unreadCount={item.unreadCount}
            onPress={() => router.push(`../conversation?otherId=${item.otherId}`)}
          />
        )}
      />

      {myId && (
        <MessagePicker
          visible={pickerVisible}
          myId={myId}
          onClose={() => setPickerVisible(false)}
          onSelect={handlePickUser}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
  },
  newButton: {
    marginTop: 24,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyList: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyBody: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});