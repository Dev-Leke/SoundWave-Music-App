import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TrackItem from "../components/TrackItem";
import { Colors, Layout, Radii, Spacing, Typography } from "../constants/theme";
import { SONGS, Song } from "../data/songs";
import { addRecentlyPlayed, loadRecentlyPlayed } from "../data/storage";
import { usePlayerStore } from "../store/playerStore";

export default function LibraryScreen() {
  const navigation = useNavigation<any>();
  const playTrack = usePlayerStore((state) => state.playTrack);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [activeTab, setActiveTab] = useState<"Songs" | "Albums" | "Artists">(
    "Songs",
  );

  useEffect(() => {
    const load = async () => {
      setRecentlyPlayed(await loadRecentlyPlayed());
    };

    load();
  }, []);

  const openSong = async (song: Song, queue: Song[]) => {
    playTrack(song, queue);
    await addRecentlyPlayed(song);
    navigation.navigate("NowPlaying");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Your songs, albums, and artists.</Text>
      </View>

      <View style={styles.segmentBar}>
        {(["Songs", "Albums", "Artists"] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.segmentButton,
              activeTab === tab && styles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === tab && styles.segmentTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "Songs" && (
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          {recentlyPlayed.length > 0 ? (
            recentlyPlayed
              .slice(0, 3)
              .map((song, index) => (
                <TrackItem
                  key={`${song.id}-recent-${index}`}
                  track={song}
                  queue={recentlyPlayed}
                  showNumber={index + 1}
                  onPress={() => openSong(song, recentlyPlayed)}
                />
              ))
          ) : (
            <Text style={styles.emptyText}>Recently played songs will show here.</Text>
          )}

          <Text style={styles.sectionTitle}>All Songs</Text>
          {SONGS.map((item, index) => (
            <TrackItem
              key={item.id}
              track={item}
              queue={SONGS}
              showNumber={index + 1}
              onPress={() => openSong(item, SONGS)}
            />
          ))}
        </View>
      )}

      {activeTab !== "Songs" && (
        <View style={styles.block}>
          <View style={styles.featureGrid}>
            {activeTab === "Albums"
              ? ["Moonlight", "Sunset Drive", "Neon Echo", "Nightfall"].map(
                  (name) => (
                    <View key={name} style={styles.featureCard}>
                      <Text style={styles.featureLetter}>{name.charAt(0)}</Text>
                      <Text style={styles.featureTitle}>{name}</Text>
                    </View>
                  ),
                )
              : ["Ava Lane", "North Pulse", "Milo Vale", "Sofia Quinn"].map(
                  (name) => (
                    <View key={name} style={styles.featureCard}>
                      <Text style={styles.featureLetter}>{name.charAt(0)}</Text>
                      <Text style={styles.featureTitle}>{name}</Text>
                    </View>
                  ),
                )}
          </View>
        </View>
      )}
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
  segmentBar: {
    flexDirection: "row",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.full,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentButton: {
    flex: 1,
    borderRadius: Radii.full,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
  },
  segmentText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  segmentTextActive: {
    color: Colors.textPrimary,
  },
  block: {
    gap: Spacing.md,
  },
  recentBlock: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  featureCard: {
    width: "47%",
    minHeight: 110,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "space-between",
  },
  featureLetter: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: Typography.extrabold,
  },
  featureTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  emptyText: {
    color: Colors.textSecondary,
  },
});
