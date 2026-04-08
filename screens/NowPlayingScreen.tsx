import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Radii, Spacing, Typography } from "../constants/theme";
import { formatDuration } from "../data/songs";
import VolumeControl from "../components/VolumeControl";
import { usePlayerStore } from "../store/playerStore";

export default function NowPlayingScreen() {
  const navigation = useNavigation<any>();
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    previous,
    next,
    togglePlay,
    setVolume,
  } = usePlayerStore();

  if (!currentTrack) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyTitle}>Nothing is playing</Text>
        <Text style={styles.emptySubtitle}>
          Choose a song from Home or Library.
        </Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const elapsed = Math.round((progress / 100) * duration);

  return (
    <LinearGradient colors={["#1B0F33", "#09070F"]} style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.artwork}>
        <LinearGradient
          colors={["#B88CFF", "#5B2ECC"]}
          style={styles.artworkGlow}
        />
        <View style={styles.artworkDisc}>
          <Text style={styles.artworkText}>{currentTrack.title.charAt(0)}</Text>
        </View>
      </View>

      <View style={styles.trackMeta}>
        <Text style={styles.trackTitle}>{currentTrack.title}</Text>
        <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatDuration(elapsed)}</Text>
          <Text style={styles.timeText}>{formatDuration(duration)}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={previous} style={styles.secondaryButton}>
          <Ionicons
            name="play-skip-back"
            size={26}
            color={Colors.textPrimary}
          />
        </Pressable>
        <Pressable onPress={togglePlay} style={styles.primaryButton}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={30}
            color={Colors.textPrimary}
          />
        </Pressable>
        <Pressable onPress={next} style={styles.secondaryButton}>
          <Ionicons
            name="play-skip-forward"
            size={26}
            color={Colors.textPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.volumeCard}>
        <VolumeControl value={volume} onChange={setVolume} />
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerLabel}>Queue</Text>
        <Text style={styles.footerValue}>
          {currentTrack ? "Playing from your current queue" : "No queue loaded"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  headerSpacer: {
    width: 40,
  },
  artwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: Radii.xl,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  artworkGlow: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    borderRadius: Radii.xl,
    opacity: 0.55,
  },
  artworkDisc: {
    width: "78%",
    aspectRatio: 1,
    borderRadius: Radii.xl,
    backgroundColor: "rgba(8,8,14,0.95)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  artworkText: {
    color: Colors.textPrimary,
    fontSize: 72,
    fontWeight: Typography.extrabold,
  },
  trackMeta: {
    alignItems: "center",
    gap: 6,
  },
  trackTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    textAlign: "center",
  },
  trackArtist: {
    color: Colors.textSecondary,
    fontSize: Typography.md,
  },
  progressBlock: {
    gap: Spacing.sm,
  },
  progressTrack: {
    height: 4,
    borderRadius: Radii.full,
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  secondaryButton: {
    width: 58,
    height: 58,
    borderRadius: Radii.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    width: 76,
    height: 76,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  footerCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: 4,
  },
  volumeCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: Radii.xl,
    padding: Spacing.lg,
  },
  footerLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footerValue: {
    color: Colors.textPrimary,
  },
  emptyScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
});
