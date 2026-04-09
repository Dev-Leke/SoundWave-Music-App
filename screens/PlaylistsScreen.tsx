import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import PlaylistCard from "../components/PlaylistCard";
import { Colors, Layout, Radii, Spacing, Typography } from "../constants/theme";
import { DEFAULT_PLAYLISTS, Playlist } from "../data/songs";
import { addRecentlyPlayed, loadPlaylists } from "../data/storage";
import { usePlayerStore } from "../store/playerStore";

export default function PlaylistsScreen() {
  const navigation = useNavigation<any>();
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS);

  useEffect(() => {
    const load = async () => {
      setPlaylists(await loadPlaylists());
    };

    load();
  }, []);

  const openPlaylist = async (playlist: Playlist) => {
    const firstSong = playlist.songs[0];
    if (!firstSong) {
      return;
    }

    playTrack(firstSong, playlist.songs);
    await addRecentlyPlayed(firstSong);
    navigation.navigate("NowPlaying");
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Playlists</Text>
            <Text style={styles.subtitle}>Saved on this device.</Text>
            <Pressable style={styles.createButton}>
              <Text style={styles.createButtonText}>+ Create Playlist</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>My Playlists</Text>
          </View>
        }
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <PlaylistCard
              item={item}
              size="large"
              onPress={() => openPlaylist(item)}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
      />
    </View>
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
  },
  header: {
    gap: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  createButtonText: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    marginTop: Spacing.md,
  },
  cardWrap: {
    flex: 1,
  },
  gridRow: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
});
