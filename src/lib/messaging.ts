// src/lib/messaging.ts
import { supabase } from '@/lib/supabase';

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface ConversationListItem {
  id: string;
  otherId: string;
  otherName: string;
  otherAvatarUrl: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface SearchedProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

type ProfileStub = SearchedProfile;

type ConversationRow = {
  id: string;
  participant_one: string;
  participant_two: string;
  last_message_preview: string | null;
  last_message_at: string | null;
  p1: ProfileStub | null;
  p2: ProfileStub | null;
};

/**
 * Returns the id of the conversation between two users, creating it if it
 * doesn't exist yet. Participants are always stored in canonical order
 * (participant_one < participant_two) so the same pair can never produce two
 * separate conversation rows.
 */
export async function findOrCreateConversation(myId: string, otherId: string): Promise<string> {
  const [participantOne, participantTwo] = myId < otherId ? [myId, otherId] : [otherId, myId];

  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_one', participantOne)
    .eq('participant_two', participantTwo)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing.id;

  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({ participant_one: participantOne, participant_two: participantTwo })
    .select('id')
    .single();

  if (createError) {
    // Someone else may have just created the same pair (e.g. both sides
    // opening the conversation at once) -- fall back to reading it instead
    // of surfacing a duplicate-key error.
    const { data: retry } = await supabase
      .from('conversations')
      .select('id')
      .eq('participant_one', participantOne)
      .eq('participant_two', participantTwo)
      .maybeSingle();
    if (retry) return retry.id;
    throw createError;
  }

  return created.id;
}

/**
 * Fetches every conversation the user is part of, resolved to the other
 * participant's profile info, last message preview, and unread count --
 * ready to render directly in the Messages tab, newest first.
 */
export async function fetchConversations(myId: string): Promise<ConversationListItem[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `
      id,
      participant_one,
      participant_two,
      last_message_preview,
      last_message_at,
      p1:participant_one ( id, full_name, avatar_url ),
      p2:participant_two ( id, full_name, avatar_url )
    `
    )
    .or(`participant_one.eq.${myId},participant_two.eq.${myId}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error || !data) return [];

  const rows = data as unknown as ConversationRow[];
  const unreadMap = await fetchUnreadCounts(
    myId,
    rows.map((r) => r.id)
  );

  return rows.map((row) => {
    const isParticipantOne = row.participant_one === myId;
    const other = isParticipantOne ? row.p2 : row.p1;
    const otherId = other?.id ?? (isParticipantOne ? row.participant_two : row.participant_one);

    return {
      id: row.id,
      otherId,
      otherName: other?.full_name ?? 'FitAthlete User',
      otherAvatarUrl: other?.avatar_url ?? null,
      lastMessagePreview: row.last_message_preview,
      lastMessageAt: row.last_message_at,
      unreadCount: unreadMap[row.id] ?? 0,
    };
  });
}

async function fetchUnreadCounts(myId: string, conversationIds: string[]): Promise<Record<string, number>> {
  if (conversationIds.length === 0) return {};

  const { data, error } = await supabase
    .from('messages')
    .select('conversation_id')
    .in('conversation_id', conversationIds)
    .neq('sender_id', myId)
    .is('read_at', null);

  if (error || !data) return {};

  return (data as { conversation_id: string }[]).reduce<Record<string, number>>((acc, row) => {
    acc[row.conversation_id] = (acc[row.conversation_id] ?? 0) + 1;
    return acc;
  }, {});
}

/** Fetches the full message history for a conversation, oldest first. */
export async function fetchMessages(conversationId: string): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as MessageRow[];
}

/** Sends a message and returns the inserted row. No-ops on empty content. */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<{ data: MessageRow | null; error: any }> {
  const trimmed = content.trim();
  if (!trimmed) return { data: null, error: null };

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: trimmed,
    })
    .select()
    .single();

  return { data: (data as MessageRow) ?? null, error };
}

/** Marks every unread message from the other participant as read. */
export async function markConversationRead(conversationId: string, myId: string): Promise<void> {
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', myId)
    .is('read_at', null);
}

/** Subscribes to new messages in a single conversation. Returns an unsubscribe fn. */
export function subscribeToMessages(conversationId: string, onInsert: (message: MessageRow) => void): () => void {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload: { new: MessageRow }) => onInsert(payload.new)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribes to anything that could affect the conversation list (new
 * messages anywhere, or conversation rows changing). RLS keeps a refetch
 * scoped to what the caller can actually see, so this just needs to signal
 * "something changed, refresh" rather than filter server-side.
 */
export function subscribeToConversationList(onChange: () => void): () => void {
  const channel = supabase
    .channel('conversations-list')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, onChange)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Searches profiles by name, excluding the current user -- for starting a new conversation. */
export async function searchProfiles(query: string, excludeId: string): Promise<SearchedProfile[]> {
  let request = supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .neq('id', excludeId)
    .order('full_name', { ascending: true })
    .limit(30);

  if (query.trim()) {
    request = request.ilike('full_name', `%${query.trim()}%`);
  }

  const { data, error } = await request;
  if (error || !data) return [];
  return data as SearchedProfile[];
}