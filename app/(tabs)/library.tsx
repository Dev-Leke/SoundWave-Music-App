// app/(tabs)/library.tsx
// Library screen — shows the user's saved Songs, Albums, and Artists.
// Uses 3 custom top tabs to switch between content.
// NOTE: User endpoints require auth — we fall back to chart data until
// auth is implemented so the screen still works without login.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DeezerAPI,
  DeezerTrack,
  DeezerAlbumFull,
  DeezerArtist,
} from "../../services/deezer";
import TrackItem from "../../components/TrackItem";
import PlaylistCard from "../../components/PlaylistCard";
import {
  Colors,
  Typography,
  Spacing,
  Radii,
  Layout,
} from "../../constants/theme";

// ─── Tab options ──────────────────────────────────────────────────────────────

const TABS = ["Songs", "Albums", "Artists"] as const;
type TabType = (typeof TABS)[number];

// getUniqueArtists

const getUniqueArtists = (tracks: DeezerTrack[]): DeezerArtist[] => {
  const artists = tracks.map((track) => track.artist);
  const seen = new Map<number, DeezerArtist>();
  artists.forEach((artist) => seen.set(artist.id, artist));
  const uniqueArtists = Array.from(seen.values());
  return uniqueArtists;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabType>("Songs");
  const [favTracks, setFavTracks] = useState<DeezerTrack[]>([]);
  const [favAlbums, setFavAlbums] = useState<DeezerAlbumFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uniqueArtists = getUniqueArtists(favTracks);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [tracksRes, albumsRes] = await Promise.all([
          DeezerAPI.getChartTracks(20),
          DeezerAPI.getChartPlaylists(12),
        ]);

        setFavTracks(tracksRes.data);
        setFavAlbums(albumsRes.data as unknown as DeezerAlbumFull[]);
      } catch (err) {
        setError("Failed to load library. Check your connection.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  // ─── Loading state ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading library...</Text>
      </View>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Text style={styles.title}>Library</Text>
      </View>

      {/* ── Top tabs ── */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              //check if activeTab === tab to highlight it
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)} // setActiveTab on press
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "Songs" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Layout.bottomInset + Spacing.xl,
            paddingTop: Spacing.sm,
          }}
        >
          {favTracks.map((track) => (
            <TrackItem key={track.id} track={track} queue={favTracks} />
          ))}
        </ScrollView>
      )}

      {/* Albums tab  */}
      {activeTab === "Albums" && (
        <FlatList
          data={favAlbums}
          keyExtractor={(item) => String(item.id)}
          numColumns={2} // 2-column grid
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PlaylistCard
              item={item}
              size="large"
              onPress={() => console.log("Album pressed:", item.title)}
            />
          )}
        />
      )}

      {/* Artists tab using getUniqueArtists function! */}
      {activeTab === "Artists" && (
        <FlatList
          data={uniqueArtists}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingBottom: Layout.bottomInset + Spacing.xl,
            paddingTop: Spacing.sm,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ArtistItem artist={item} />}
        />
      )}
    </View>
  );
}

// ─── ArtistItem

function ArtistItem({ artist }: { artist: DeezerArtist }) {
  return (
    <TouchableOpacity style={artistStyles.container} activeOpacity={0.7}>
      <Image
        source={{ uri: artist.picture_medium }}
        style={artistStyles.avatar}
      />
      <Text style={artistStyles.name}>{artist.name}</Text>
    </TouchableOpacity>
  );
}

const artistStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radii.full, // circle — standard for artist avatars
    backgroundColor: Colors.surface,
  },
  name: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

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

  // ── Header ──
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  title: {
    fontSize: Typography.xxl,
    color: Colors.textPrimary,
    fontWeight: Typography.extrabold,
  },

  // ── Top tabs ──
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  activeTab: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  tabText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },

  activeTabText: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },

  // ── Albums grid ──
  grid: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Layout.bottomInset + Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },

  gridRow: {
    gap: Spacing.md,
  },
});
