// components/MiniPlayer.tsx
// The small persistent player bar that appears above the tab bar on every screen.
// Shows current track info, a progress bar, and play/pause + skip buttons.
// Tapping it navigates to the full Now Playing screen.

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Layout, Radii, Spacing, Typography } from "../constants/theme";
import { usePlayerStore } from "../store/playerStore";

// ─── Component ────────────────────────────────────────────────────────────────

export default function MiniPlayer() {
  const router = useRouter();

  // Pull everything we need from the global player store
  const {
    currentTrack,
    isPlaying,
    isLoading,
    positionMs,
    durationMs,
    togglePlay,
    next,
  } = usePlayerStore();

  const handleTogglePlay = useCallback(
    (e: any) => {
      // Stop the press from bubbling up to the parent Pressable
      // (which would open Now Playing)
      e.stopPropagation();
      togglePlay();
    },
    [togglePlay],
  );

  const handleNext = useCallback(
    (e: any) => {
      e.stopPropagation();
      next();
    },
    [next],
  );

  // Progress as a value between 0 and 1 — used for the progress bar width
  const progress = durationMs > 0 ? positionMs / durationMs : 0;

  const handleOpenNowPlaying = () => {
    // TODO: uncomment when now-playing.tsx is built
    // router.push('/now-playing');
    console.log("Now Playing screen coming soon!");
  };
  // If no track is loaded yet, render nothing — mini player stays hidden
  if (!currentTrack) return null;

  return (
    // Outer wrapper — sits above the tab bar
    <View style={styles.wrapper}>
      {/* Tap anywhere on the bar (except buttons) to open Now Playing */}
      <Pressable style={styles.container} onPress={handleOpenNowPlaying}>
        {/* Blurred dark background with subtle border */}
        <LinearGradient
          colors={["rgba(40,20,70,0.95)", "rgba(20,10,40,0.98)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Progress bar — thin line at the very top of the mini player */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {/* Main content row */}
        <View style={styles.content}>
          {/* Album art */}
          <View style={styles.artWrapper}>
            <Image
              source={{ uri: currentTrack.album.cover_small }}
              style={styles.albumArt}
            />
            {/* Purple glow behind album art */}
            <View style={styles.artGlow} />
          </View>

          {/* Track title + artist — takes up remaining space */}
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist.name}
            </Text>
          </View>

          {/* Control buttons */}
          <View style={styles.controls}>
            {/* Play / Pause button */}
            <TouchableOpacity
              style={styles.playButton}
              onPress={handleTogglePlay}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.textPrimary} />
              ) : (
                <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶️"}</Text>
              )}
            </TouchableOpacity>

            {/* Skip next button */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.nextIcon}>⏭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Outer wrapper — positioned above the tab bar
  wrapper: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    // Sits just above the tab bar
    bottom: Layout.tabBarHeight + Spacing.xxl,
    zIndex: 100, // always on top of screen content
    borderRadius: Radii.xl,
    overflow: "hidden",
    // Shadow for iOS
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 12,
  },

  container: {
    borderRadius: Radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(124, 77, 255, 0.3)", // subtle purple border
  },

  // ── Progress bar ──
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: "100%",
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },

  // ── Main content row ──
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    height: Layout.miniPlayerHeight,
  },

  // ── Album art ──
  artWrapper: {
    position: "relative",
  },

  albumArt: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
  },

  artGlow: {
    position: "absolute",
    top: 4,
    left: 4,
    right: 4,
    bottom: -4,
    backgroundColor: Colors.primary,
    opacity: 0.4,
    borderRadius: Radii.md,
    zIndex: -1,
  },

  // ── Track info ──
  info: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },

  artist: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },

  // ── Controls ──
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  playButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    fontSize: 16,
  },

  nextButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  nextIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
});
