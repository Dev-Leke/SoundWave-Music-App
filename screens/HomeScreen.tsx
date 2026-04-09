import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import PlaylistCard from "../components/PlaylistCard";
import TrackItem from "../components/TrackItem";
import { Colors, Layout, Radii, Spacing, Typography } from "../constants/theme";
import { DEFAULT_PLAYLISTS, Playlist, SONGS, Song } from "../data/songs";
import {
    addRecentlyPlayed,
    loadPlaylists,
    loadRecentlyPlayed,
} from "../data/storage";
import { usePlayerStore } from "../store/playerStore";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [displaySongs, setDisplaySongs] = useState<Song[]>(SONGS.slice(0, 4));

  useEffect(() => {
    const load = async () => {
      const [recent, savedPlaylists] = await Promise.all([
        loadRecentlyPlayed(),
        loadPlaylists(),
      ]);

      setRecentlyPlayed(recent);
      setPlaylists(savedPlaylists);
    };

    load();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setDisplaySongs(SONGS.slice(0, 4));
      return;
    }

    const matches = SONGS.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query),
    );
    setDisplaySongs(matches.slice(0, 6));
  }, [searchQuery]);

  const openSong = async (song: Song, queue: Song[]) => {
    playTrack(song, queue);
    await addRecentlyPlayed(song);
    navigation.navigate("NowPlaying");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTextBlock}>
          <Text style={styles.kicker}>SoundWave</Text>
          <Text style={styles.title}>Good evening</Text>
          <Text style={styles.subtitle}>
            Browse the library and keep playback handy.
          </Text>
        </View>
        <View style={styles.heroIcon}>
          <Ionicons name="musical-notes" size={22} color={Colors.textPrimary} />
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search songs"
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? "Search Results" : "Recent Songs"}
        </Text>
        {(searchQuery
          ? displaySongs
          : recentlyPlayed.length > 0
            ? recentlyPlayed.slice(0, 3)
            : SONGS.slice(0, 3)
        ).map((song, index) => (
          <TrackItem
            key={song.id}
            track={song}
            queue={searchQuery ? displaySongs : SONGS}
            showNumber={index + 1}
            onPress={() => openSong(song, searchQuery ? displaySongs : SONGS)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested Tracks</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>
        {SONGS.slice(4, 8).map((song, index) => (
          <TrackItem
            key={`recommended-${song.id}`}
            track={song}
            queue={SONGS.slice(4, 8)}
            showNumber={index + 1}
            onPress={() => openSong(song, SONGS.slice(4, 8))}
          />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Playlists</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.playlistRow}
          renderItem={({ item }) => (
            <PlaylistCard
              item={item}
              size="small"
              onPress={() => openSong(item.songs[0], item.songs)}
            />
          )}
        />
      </View>

      <Pressable
        style={styles.actionCard}
        onPress={() => navigation.navigate("Library")}
      >
        <Text style={styles.actionTitle}>Open Library</Text>
        <Text style={styles.actionSubtitle}>See the full song list.</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Layout.bottomInset + Layout.miniPlayerHeight,
    gap: Spacing.xl,
  },
  hero: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroTextBlock: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  kicker: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    marginTop: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.md,
    paddingVertical: 0,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  sectionAction: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
  },
  emptyText: {
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  playlistRow: {
    gap: Spacing.md,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  actionSubtitle: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
