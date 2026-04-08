// components/TrackItem.tsx
// A single track row — used in Home, Library, Search, and Playlist screens.
// Shows album art, track title, artist name, duration, and a play indicator.

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { DeezerTrack, formatDuration } from "../services/deezer";
import { usePlayerStore } from "../store/playerStore";
import { Colors, Typography, Spacing, Radii } from "../constants/theme";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TrackItemProps {
  track: DeezerTrack;
  queue?: DeezerTrack[]; // the list this track belongs to (for queueing)
  showNumber?: number; // optional track number shown instead of album art
  onPress?: () => void; // override default play behavior if needed
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrackItem({
  track,
  queue,
  showNumber,
  onPress,
}: TrackItemProps) {
  // Read player state from global store
  const { currentTrack, isPlaying, isLoading, playTrack } = usePlayerStore();

  // Is THIS track the one currently loaded in the player?
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    // Play this track, passing the full queue so next/prev work
    playTrack(track, queue ?? [track]);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        // Highlight the row if this track is currently playing
        isCurrentTrack && styles.activeContainer,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Left side — either a track number or album art */}
      {showNumber !== undefined ? (
        <View style={styles.numberContainer}>
          {isCurrentTrack && isPlaying ? (
            // Animated bars icon when playing — we fake it with colored dots
            <View style={styles.playingIndicator}>
              <View style={[styles.bar, styles.bar1]} />
              <View style={[styles.bar, styles.bar2]} />
              <View style={[styles.bar, styles.bar3]} />
            </View>
          ) : (
            <Text
              style={[styles.trackNumber, isCurrentTrack && styles.activeText]}
            >
              {showNumber}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.artContainer}>
          <Image
            source={{ uri: track.album.cover_small }}
            style={styles.albumArt}
          />
          {/* Loading spinner overlay when this track is loading */}
          {isCurrentTrack && isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}
          {/* Purple tint overlay when this track is active */}
          {isCurrentTrack && !isLoading && (
            <View style={styles.activeOverlay} />
          )}
        </View>
      )}

      {/* Middle — title and artist */}
      <View style={styles.info}>
        <Text
          style={[styles.title, isCurrentTrack && styles.activeText]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist.name}
        </Text>
      </View>

      {/* Right side — duration */}
      <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // lay children left to right
    alignItems: "center", // vertically center everything
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.md, // space between each child
  },

  // Subtle purple tint on the active row
  activeContainer: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: Radii.md,
  },

  // ── Track number (used in playlist detail view) ──
  numberContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  trackNumber: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },

  // ── Playing indicator (3 animated bars) ──
  playingIndicator: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 16,
  },

  bar: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  bar1: { height: 10 },
  bar2: { height: 16 },
  bar3: { height: 7 },

  // ── Album art ──
  artContainer: {
    position: "relative", // so overlays can position absolutely inside
  },

  albumArt: {
    width: 48,
    height: 48,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surface,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // covers the whole albumArt
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: Radii.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  activeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primaryGlow,
    borderRadius: Radii.sm,
  },

  // ── Text info ──
  info: {
    flex: 1, // takes up all remaining horizontal space
    gap: 3,
  },

  title: {
    fontSize: Typography.md,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },

  artist: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },

  // ── Duration ──
  duration: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    minWidth: 36, // keeps alignment consistent across rows
    textAlign: "right",
  },

  // Purple color for active track text
  activeText: {
    color: Colors.primary,
  },
});
