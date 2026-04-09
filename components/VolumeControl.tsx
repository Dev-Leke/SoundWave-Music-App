import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { Colors, Spacing, Typography } from "../constants/theme";

interface VolumeControlProps {
  value: number;
  onChange: (volume: number) => void;
}

export default function VolumeControl({ value, onChange }: VolumeControlProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Volume</Text>
        <Text style={styles.value}>{Math.round(value * 100)}%</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.surfaceAlt}
        thumbTintColor={Colors.textPrimary}
      />

      <View style={styles.legendRow}>
        <Text style={styles.legend}>Low</Text>
        <Text style={styles.legend}>High</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: Colors.textPrimary,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  value: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  slider: {
    width: "100%",
    height: 36,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legend: {
    color: Colors.textSecondary,
    fontSize: Typography.xs,
  },
});