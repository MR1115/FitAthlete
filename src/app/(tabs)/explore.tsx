import EmptyState from '@/components/(explore)/EmptyState';
import FilterSheet from '@/components/(explore)/FilterSheet';
import MentorCard, { Mentor } from '@/components/(explore)/MentorCard';
import MentorPreview from '@/components/(explore)/MentorPreview';
import SearchBar from '@/components/(explore)/SearchBar';
import { supabase } from '@/lib/supabase';
import { colors, globalStyles } from '@/styles/global';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type MentorRow = {
  profile_id: string;
  bio: string | null;
  sports: string[];
  hourly_rate: number | null;
  years_experience: number | null;
  profiles: {
    full_name: string;
    city: string | null;
    state: string | null;
    avatar_url: string | null;
  } | null;
};

export default function ExploreScreen() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMentors();
  }, []);

  async function loadMentors() {
    setLoading(true);

    const { data, error } = await supabase
      .from('mentor_profiles')
      .select(`
        profile_id,
        bio,
        sports,
        hourly_rate,
        years_experience,
        profiles (
          full_name,
          city,
          state,
          avatar_url
        )
      `);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    const mapped: Mentor[] =
      (data as unknown as MentorRow[]).map((mentor) => ({
        profile_id: mentor.profile_id,
        bio: mentor.bio,
        full_name: mentor.profiles?.full_name ?? '',
        city: mentor.profiles?.city ?? null,
        state: mentor.profiles?.state ?? null,
        avatar_url: mentor.profiles?.avatar_url ?? null,
        sports: mentor.sports ?? [],
        hourly_rate: mentor.hourly_rate,
        years_experience: mentor.years_experience,
      }));

    setMentors(mapped);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);

    await loadMentors();

    setRefreshing(false);
  }

  function toggleSport(sport: string) {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  }

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const query = search.toLowerCase();

      const matchesSearch =
        mentor.full_name.toLowerCase().includes(query) ||
        mentor.city?.toLowerCase().includes(query) ||
        mentor.state?.toLowerCase().includes(query) ||
        mentor.sports.some((sport: string) =>
          sport.toLowerCase().includes(query)
        );

      const matchesSport =
        selectedSports.length === 0 ||
        selectedSports.some((sport) =>
          mentor.sports.includes(sport)
        );

      return matchesSearch && matchesSport;
    });
  }, [mentors, search, selectedSports]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Explore</Text>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onFilterPress={() => setFilterVisible(true)}
        onRefresh={handleRefresh}
      />

      <FlatList
        data={filteredMentors}
        keyExtractor={(item) => item.profile_id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <MentorCard
            mentor={item}
            onPress={() => setSelectedMentor(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            onClearFilters={() => {
              setSearch('');
              setSelectedSports([]);
            }}
          />
        }
      />

      <FilterSheet
        visible={filterVisible}
        selectedSports={selectedSports}
        onToggleSport={toggleSport}
        onClose={() => setFilterVisible(false)}
        onClear={() => setSelectedSports([])}
      />

      <MentorPreview
        mentor={selectedMentor}
        visible={selectedMentor !== null}
        onClose={() => setSelectedMentor(null)}
        onViewProfile={() => {
          if (!selectedMentor) return;

          setSelectedMentor(null);
          //router.push(`../mentor/${selectedMentor.profile_id}`);
        }}
      />
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

  list: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});