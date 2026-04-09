import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Colors, Radii, Spacing, Typography } from "../constants/theme";
import VolumeControl from "../components/VolumeControl";
import { resetDemoData } from "../data/storage";
import { usePlayerStore } from "../store/playerStore";

export default function SettingsScreen() {
  const shuffle = usePlayerStore((state) => state.isShuffle);
  const repeat = usePlayerStore((state) => state.isRepeat);
  const volume = usePlayerStore((state) => state.volume);
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle);
  const toggleRepeat = usePlayerStore((state) => state.toggleRepeat);
  const setVolume = usePlayerStore((state) => state.setVolume);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Playback controls and local storage.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Playback</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Shuffle</Text>
          <Switch
            value={shuffle}
            onValueChange={toggleShuffle}
            trackColor={{ false: Colors.border, true: Colors.primaryDark }}
            ios_backgroundColor={Colors.border}
            thumbColor={Colors.textPrimary}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Repeat</Text>
          <Switch
            value={repeat}
            onValueChange={toggleRepeat}
            trackColor={{ false: Colors.border, true: Colors.primaryDark }}
            ios_backgroundColor={Colors.border}
            thumbColor={Colors.textPrimary}
          />
        </View>
        <VolumeControl value={volume} onChange={setVolume} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Storage</Text>
        <Text style={styles.supportingText}>
          Playlists and recent songs are stored locally with AsyncStorage.
        </Text>
        <Pressable style={styles.button} onPress={resetDemoData}>
          <Text style={styles.buttonText}>Reset demo data</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.supportingText}>
          SoundWave is a lightweight music player with saved playlists and a
          persistent mini player.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    color: Colors.textPrimary,
  },
  rowValue: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  supportingText: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
});
