import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Radii, Spacing, Typography } from "../constants/theme";
import { formatDuration, Song } from "../data/songs";
import { usePlayerStore } from "../store/playerStore";

interface TrackItemProps {
  track: Song;
  queue?: Song[];
  showNumber?: number;
  onPress?: () => void;
}

export default function TrackItem({
  track,
  queue,
  showNumber,
  onPress,
}: TrackItemProps) {
  const { currentTrack, isPlaying, playTrack } = usePlayerStore();
  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    playTrack(track, queue ?? [track]);
  };

  return (
    <Pressable
      style={[styles.container, isCurrentTrack && styles.activeContainer]}
      onPress={handlePress}
    >
      {showNumber !== undefined ? (
        <View style={styles.numberContainer}>
          <Text
            style={[styles.trackNumber, isCurrentTrack && styles.activeText]}
          >
            {isCurrentTrack && isPlaying ? "▶" : showNumber}
          </Text>
        </View>
      ) : (
        <View style={styles.artContainer}>
          <View style={[styles.albumArt, isCurrentTrack && styles.activeArt]}>
            <Text style={styles.albumLetter}>{track.title.charAt(0)}</Text>
          </View>
        </View>
      )}

      <View style={styles.info}>
        <Text
          style={[styles.title, isCurrentTrack && styles.activeText]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>

      <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },

  activeContainer: {
    backgroundColor: Colors.primaryGlow,
    borderRadius: Radii.md,
  },

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

  artContainer: {
    position: "relative",
  },

  albumArt: {
    width: 48,
    height: 48,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  activeArt: {
    backgroundColor: Colors.primaryDark,
  },

  albumLetter: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },

  info: {
    flex: 1,
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
    minWidth: 40,
    textAlign: "right",
  },

  activeText: {
    color: Colors.primary,
  },
});
