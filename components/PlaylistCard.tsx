// components/PlaylistCard.tsx
// A playlist or album card shown in grids across Home and Playlists screens.
// Comes in two sizes: 'large' (square grid card) and 'small' (horizontal scroll).

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Radii, Spacing, Typography } from "../constants/theme";
import { DeezerAlbumFull, DeezerPlaylist } from "../services/deezer";

// ─── Screen width — used to calculate card sizes ──────────────────────────────
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_PADDING = Spacing.lg * 2; // padding on both sides
const GAP = Spacing.md; // gap between cards in a 2-column grid

// Card sizes
const LARGE_CARD_SIZE = (SCREEN_WIDTH - SCREEN_PADDING - GAP) / 2; // 2-column grid
const SMALL_CARD_SIZE = 140; // fixed width for horizontal scroll cards

// ─── Props ────────────────────────────────────────────────────────────────────

interface PlaylistCardProps {
  item: DeezerPlaylist | DeezerAlbumFull; // works for both playlists and albums
  size?: "large" | "small";
  onPress?: () => void;
}

// ─── Type guard — is it a playlist or an album? ───────────────────────────────
// Playlists have 'nb_tracks', albums have 'artist'
const isPlaylist = (
  item: DeezerPlaylist | DeezerAlbumFull,
): item is DeezerPlaylist => "nb_tracks" in item && !("artist" in item);

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlaylistCard({
  item,
  size = "large",
  onPress,
}: PlaylistCardProps) {
  const isLarge = size === "large";
  const cardSize = isLarge ? LARGE_CARD_SIZE : SMALL_CARD_SIZE;

  // Pick the right image URL based on card size
  // Pick the right image URL — playlists use picture_*, albums use cover_*
  const imageUrl = isLarge
    ? ((item as DeezerPlaylist).picture_big ??
      (item as DeezerAlbumFull).cover_big ??
      (item as DeezerPlaylist).picture_medium ??
      (item as DeezerAlbumFull).cover_medium)
    : ((item as DeezerPlaylist).picture_medium ??
      (item as DeezerAlbumFull).cover_medium ??
      (item as DeezerPlaylist).picture_small ??
      (item as DeezerAlbumFull).cover_small ??
      "");

  // Build the subtitle — "24 songs" for playlists, artist name for albums
  const subtitle = isPlaylist(item)
    ? `${item.nb_tracks} songs`
    : ((item as DeezerAlbumFull).artist?.name ?? "");

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardSize }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Album / Playlist cover art */}
      <View
        style={[styles.imageContainer, { width: cardSize, height: cardSize }]}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          // Fallback background color while image loads
        />

        {/* Dark gradient overlay at the bottom — makes text readable */}
        <LinearGradient
          colors={Colors.gradientCard}
          style={styles.gradient}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* Title and subtitle below the image */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // width is set dynamically above based on size prop
  },

  imageContainer: {
    borderRadius: Radii.lg,
    overflow: "hidden", // clips image and gradient to rounded corners
    backgroundColor: Colors.surface,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  // Gradient sits on top of the image at the bottom
  gradient: {
    ...StyleSheet.absoluteFillObject, // covers entire imageContainer
  },

  textContainer: {
    marginTop: Spacing.sm,
    gap: 2,
    paddingHorizontal: 2,
  },

  title: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },

  subtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
});
