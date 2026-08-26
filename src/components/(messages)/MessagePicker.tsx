import { searchProfiles, type SearchedProfile } from '@/lib/messaging';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Avatar from '../(profile)/Avatar';

type Props = {
  visible: boolean;
  myId: string;
  onClose: () => void;
  onSelect: (profile: SearchedProfile) => void;
};

export default function MessagePicker({ visible, myId, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setQuery('');
    load('');
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => load(query), 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, visible]);

  async function load(q: string) {
    setIsLoading(true);
    const data = await searchProfiles(q, myId);
    setResults(data);
    setIsLoading(false);
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>New Message</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
          />
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.empty}>No one matches that search.</Text>}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() => onSelect(item)}
              >
                <Avatar uri={item.avatar_url} name={item.full_name} size={46} />
                <Text style={styles.name}>{item.full_name}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cancel: {
    color: colors.primary,
    fontSize: 16,
    width: 50,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#e4e4ec',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  loading: {
    marginTop: 30,
  },
  list: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});