import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Colors, Typography, Spacing, Radii } from "../../constants/theme";

export default function SettingsScreen() {
  const [autoplay, setAutoplay] = useState(true);
  const [wifiDownload, setWifiDownload] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
    
      <Text style={styles.header}>Settings</Text>

      
      <Text style={styles.sectionTitle}>Playback Preferences</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Autoplay</Text>
          <Switch value={autoplay} onValueChange={setAutoplay} />
        </View>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Audio Quality</Text>
          <Text style={styles.value}>High ›</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.label}>Download Over Wi-Fi Only</Text>
          <Switch value={wifiDownload} onValueChange={setWifiDownload} />
        </View>
      </View>

     
      <Text style={styles.sectionTitle}>Theme</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

     
      <Text style={styles.sectionTitle}>About</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Version 1.0</Text>
          <Text style={styles.value}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  header: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },

  label: {
    fontSize: Typography.md,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },

  value: {
    fontSize: Typography.md,
    color: Colors.textSecondary,
  },
});