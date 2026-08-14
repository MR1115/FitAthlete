import Avatar from '@/components/(profile)/Avatar';
import { useAuth } from '@/context/AuthContext';
import {
    fetchMessages,
    findOrCreateConversation,
    markConversationRead,
    sendMessage,
    subscribeToMessages,
    type MessageRow,
} from '@/lib/messaging';
import { supabase } from '@/lib/supabase';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import MessageBubble from './MessageBubble';

type OtherProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
};

type ListItem =
  | { type: 'divider'; id: string; label: string }
  | { type: 'message'; id: string; message: MessageRow };

function formatBubbleTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDividerLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOfDay(date) - startOfDay(now)) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function buildListItems(messages: MessageRow[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDateKey: string | null = null;

  for (const message of messages) {
    const dateKey = message.created_at.slice(0, 10);
    if (dateKey !== lastDateKey) {
      items.push({
        type: 'divider',
        id: `divider-${dateKey}`,
        label: formatDividerLabel(message.created_at),
      });
      lastDateKey = dateKey;
    }
    items.push({ type: 'message', id: message.id, message });
  }

  return items;
}

export default function ConversationScreen() {
  const { otherId } = useLocalSearchParams<{ otherId: string }>();
  const { session } = useAuth();
  const myId = session?.user.id;

  const [otherProfile, setOtherProfile] = useState<OtherProfile | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const listRef = useRef<FlatList<ListItem>>(null);

  useEffect(() => {
    let active = true;

    async function init() {
      if (!myId || !otherId) return;
      setIsLoading(true);

      const [{ data: profileData }, id] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url').eq('id', otherId).maybeSingle(),
        findOrCreateConversation(myId, otherId),
      ]);

      if (!active) return;

      setOtherProfile(profileData ?? { id: otherId, full_name: 'FitAthlete User', avatar_url: null });
      setConversationId(id);

      const history = await fetchMessages(id);
      if (!active) return;

      setMessages(history);
      setIsLoading(false);
      markConversationRead(id, myId).catch(() => {});
    }

    init();
    return () => {
      active = false;
    };
  }, [myId, otherId]);

  useEffect(() => {
    if (!conversationId || !myId) return;

    const unsubscribe = subscribeToMessages(conversationId, (message) => {
      setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
      if (message.sender_id !== myId) {
        markConversationRead(conversationId, myId).catch(() => {});
      }
    });

    return unsubscribe;
  }, [conversationId, myId]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  useEffect(() => {
    if (messages.length > 0) scrollToEnd();
  }, [messages.length, scrollToEnd]);

  async function handleSend() {
    if (!conversationId || !myId || !draft.trim() || isSending) return;

    const content = draft.trim();
    setDraft('');
    setIsSending(true);

    const { data, error } = await sendMessage(conversationId, myId, content);
    setIsSending(false);

    if (error) {
      setDraft(content);
      return;
    }

    if (data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
    }
  }

  const listItems = useMemo(() => buildListItems(messages), [messages]);

  if (!myId || !otherId) return null;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Avatar uri={otherProfile?.avatar_url ?? null} name={otherProfile?.full_name} size={34} />
          <Text style={styles.headerName} numberOfLines={1}>
            {otherProfile?.full_name ?? 'Loading...'}
          </Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={listItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={scrollToEnd}
          ListEmptyComponent={
            <Text style={styles.empty}>
              This is the start of your conversation with {otherProfile?.full_name}.
            </Text>
          }
          renderItem={({ item }) =>
            item.type === 'divider' ? (
              <View style={styles.dividerRow}>
                <Text style={styles.dividerText}>{item.label}</Text>
              </View>
            ) : (
              <MessageBubble
                content={item.message.content}
                timeLabel={formatBubbleTime(item.message.created_at)}
                isMine={item.message.sender_id === myId}
              />
            )
          }
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <Pressable
          style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!draft.trim() || isSending}
        >
          <Ionicons name="arrow-up" size={20} color={colors.background} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#404050',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },
  headerName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    maxWidth: 200,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  dividerRow: {
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#eef0f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#404050',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e4e4ec',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});