import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Layout, Radii, Spacing, Typography } from "../constants/theme";
import { usePlayerStore } from "../store/playerStore";

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    currentTrack,
    isPlaying,
    progress,
    togglePlay,
    previous,
    next,
  } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <View
      style={[
        styles.wrapper,
        { bottom: Layout.tabBarHeight + insets.bottom + Spacing.sm },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.content}>
          <Pressable
            style={styles.info}
            onPress={() => navigation.navigate("NowPlaying")}
          >
            <View style={styles.artwork}>
              <Text style={styles.artworkText}>
                {currentTrack.title.charAt(0)}
              </Text>
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
          </Pressable>

          <View style={styles.controls}>
            <TouchableOpacity onPress={previous} style={styles.iconButton}>
              <Ionicons
                name="play-skip-back"
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={next} style={styles.iconButton}>
              <Ionicons
                name="play-skip-forward"
                size={20}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 100,
    borderRadius: Radii.xl,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Shadow for Android
    elevation: 8,
  },

  container: {
    borderRadius: Radii.xl,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

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

  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
    minHeight: Layout.miniPlayerHeight,
  },

  info: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  artwork: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  artworkText: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },

  textBlock: {
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

  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  playButton: {
    width: 42,
    height: 42,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

});
