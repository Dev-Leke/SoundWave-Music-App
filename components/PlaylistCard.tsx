import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors, Radii, Spacing, Typography } from "../constants/theme";
import { Playlist } from "../data/songs";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_PADDING = Spacing.lg * 2;
const GAP = Spacing.md;

const LARGE_CARD_SIZE = (SCREEN_WIDTH - SCREEN_PADDING - GAP) / 2;
const SMALL_CARD_SIZE = 140; // fixed width for horizontal scroll cards

interface PlaylistCardProps {
  item: Playlist;
  size?: "large" | "small";
  onPress?: () => void;
}

export default function PlaylistCard({
  item,
  size = "large",
  onPress,
}: PlaylistCardProps) {
  const isLarge = size === "large";
  const cardSize = isLarge ? LARGE_CARD_SIZE : SMALL_CARD_SIZE;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardSize }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[styles.imageContainer, { width: cardSize, height: cardSize }]}
      >
        <LinearGradient
          colors={["#2A1144", "#12091F"]}
          style={styles.gradient}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
        />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.title.charAt(0)}</Text>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.songs.length} songs
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},

  imageContainer: {
    borderRadius: Radii.lg,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    justifyContent: "flex-end",
    padding: Spacing.md,
  },

  badge: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
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
