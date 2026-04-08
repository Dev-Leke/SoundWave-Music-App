// app/(tabs)/index.tsx
// Home screen — shows recently played, recommended tracks, and popular playlists.
// Fetches real data from Deezer's public chart and search endpoints (no auth needed).

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlaylistCard from "../../components/PlaylistCard";
import TrackItem from "../../components/TrackItem";
import {
  Colors,
  Layout,
  Radii,
  Spacing,
  Typography,
} from "../../constants/theme";
import { DeezerAPI, DeezerPlaylist, DeezerTrack } from "../../services/deezer";
import { usePlayerStore } from "../../store/playerStore";

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // ── Local state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DeezerTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [chartTracks, setChartTracks] = useState<DeezerTrack[]>([]);
  const [popularPlaylists, setPopularPlaylists] = useState<DeezerPlaylist[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Player store ──
  const { currentTrack } = usePlayerStore();

  // ── Fetch chart data on mount ──
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch chart tracks and playlists in parallel
        const [tracksRes, playlistsRes] = await Promise.all([
          DeezerAPI.getChartTracks(10),
          DeezerAPI.getChartPlaylists(6),
        ]);

        setChartTracks(tracksRes.data);
        setPopularPlaylists(playlistsRes.data);
      } catch (err) {
        setError("Failed to load music. Check your connection.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // ── Search handler — fires as user types ──
  useEffect(() => {
    // Don't search if query is too short
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Debounce — wait 500ms after user stops typing before searching
    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await DeezerAPI.searchTracks(searchQuery, 15);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    // Cleanup — cancel the timer if user types again before 500ms
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─── Loading state ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading music...</Text>
      </View>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setIsLoading(true)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.md,
            // Extra bottom padding so last item isn't hidden behind MiniPlayer
            paddingBottom: Layout.bottomInset + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening 👋</Text>
            <Text style={styles.appName}>SoundWave</Text>
          </View>
          <TouchableOpacity style={styles.avatarButton}>
            <Text style={styles.avatarText}>SW</Text>
          </TouchableOpacity>
        </View>

        {/* ── Search bar ── */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Search results (shown when user is searching) ── */}
        {searchQuery.length >= 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isSearching ? "Searching..." : `Results for "${searchQuery}"`}
            </Text>
            {isSearching ? (
              <ActivityIndicator
                color={Colors.primary}
                style={styles.searchSpinner}
              />
            ) : searchResults.length === 0 ? (
              <Text style={styles.emptyText}>No results found</Text>
            ) : (
              searchResults.map((track) => (
                <TrackItem key={track.id} track={track} queue={searchResults} />
              ))
            )}
          </View>
        )}

        {/* ── Main content (hidden while searching) ── */}
        {searchQuery.length < 2 && (
          <>
            {/* ── Recently Played ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recently Played</Text>
              {chartTracks.slice(0, 3).map((track) => (
                <TrackItem key={track.id} track={track} queue={chartTracks} />
              ))}
            </View>

            {/* ── Recommended for You ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended for You</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              {chartTracks.slice(3, 7).map((track) => (
                <TrackItem key={track.id} track={track} queue={chartTracks} />
              ))}
            </View>

            {/* ── Popular Playlists ── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Playlists</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              {/* Horizontal scroll row of playlist cards */}
              <FlatList
                data={popularPlaylists}
                keyExtractor={(item) => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.playlistRow}
                renderItem={({ item }) => (
                  <PlaylistCard
                    item={item}
                    size="small"
                    onPress={() => console.log("Playlist pressed:", item.title)}
                  />
                )}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    gap: Spacing.xl,
  },

  // ── Loading / Error states ──
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
  },

  errorText: {
    color: Colors.error,
    fontSize: Typography.md,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },

  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.full,
  },

  retryText: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
    fontSize: Typography.md,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },

  greeting: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },

  appName: {
    fontSize: Typography.xxl,
    color: Colors.textPrimary,
    fontWeight: Typography.extrabold,
  },

  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    fontSize: Typography.sm,
  },

  // ── Search ──
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  searchIcon: {
    fontSize: 16,
  },

  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.md,
    paddingVertical: 0, // removes default Android padding
  },

  clearIcon: {
    color: Colors.textMuted,
    fontSize: 14,
    paddingHorizontal: Spacing.xs,
  },

  searchSpinner: {
    marginTop: Spacing.lg,
  },

  // ── Sections ──
  section: {
    gap: Spacing.sm,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.lg,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    paddingHorizontal: Spacing.lg,
  },

  seeAll: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },

  emptyText: {
    color: Colors.textMuted,
    fontSize: Typography.md,
    textAlign: "center",
    paddingVertical: Spacing.xl,
  },

  // ── Playlist row ──
  playlistRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});
