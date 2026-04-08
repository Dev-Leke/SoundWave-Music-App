// components/TabBar.tsx
// Custom bottom tab bar with icons for Home, Library, Playlists, Settings.
// Replaces Expo Router's default tab bar so we can style it to match the Figma.

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Layout, Spacing, Typography } from "../constants/theme";

// ─── Tab config — label + icons for each tab ──────────────────────────────────

const TABS = [
  {
    name: "index", // matches the file name in app/(tabs)/
    label: "Home",
    icon: "⊞",
    activeIcon: "⊞",
  },
  {
    name: "library",
    label: "Library",
    icon: "♪",
    activeIcon: "♪",
  },
  {
    name: "playlists",
    label: "Playlists",
    icon: "☰",
    activeIcon: "☰",
  },
  {
    name: "settings",
    label: "Settings",
    icon: "⚙",
    activeIcon: "⚙",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Safe area insets give us the height of the home indicator on iPhones
  // so the tab bar sits above it and doesn't get covered
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        // Add bottom padding for iPhone home indicator
        { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md },
      ]}
    >
      {/* Render one button per tab */}
      {state.routes.map((route, index) => {
        const tab = TABS.find((t) => t.name === route.name);
        if (!tab) return null;

        const isActive = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          // Only navigate if not already on this tab
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                isActive && styles.activeIconContainer,
              ]}
            >
              <Text style={[styles.icon, isActive && styles.activeIcon]}>
                {isActive ? tab.activeIcon : tab.icon}
              </Text>
            </View>

            {/* Label */}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>

            {/* Active dot indicator */}
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.elevated,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Layout.tabBarHeight + Spacing.xl,
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    // Shadow on top edge for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },

  // Each tab button takes equal width
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.sm,
    gap: 3,
    position: "relative",
  },

  // Icon wrapper — active tab gets a subtle purple pill background
  iconContainer: {
    width: 40,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },

  activeIconContainer: {
    backgroundColor: Colors.primaryGlow,
  },

  icon: {
    fontSize: 18,
    color: Colors.icon,
  },

  activeIcon: {
    color: Colors.primary,
  },

  label: {
    fontSize: Typography.xs,
    color: Colors.icon,
    fontWeight: Typography.medium,
  },

  activeLabel: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },

  // Small dot below the active tab label
  activeDot: {
    position: "absolute",
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
