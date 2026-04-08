import { Ionicons } from "@expo/vector-icons";
import {
    BottomTabBarProps,
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MiniPlayer from "../components/MiniPlayer";
import { Colors, Layout, Spacing, Typography } from "../constants/theme";
import HomeScreen from "../screens/HomeScreen";
import LibraryScreen from "../screens/LibraryScreen";
import PlaylistsScreen from "../screens/PlaylistsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Home: "Home",
  Library: "Library",
  Playlists: "Playlists",
  Settings: "Settings",
};

const getTabIcon = (routeName: keyof TabParamList, focused: boolean) => {
  const color = focused ? Colors.primary : Colors.icon;

  switch (routeName) {
    case "Home":
      return (
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={20}
          color={color}
        />
      );
    case "Library":
      return (
        <Ionicons
          name={focused ? "library" : "library-outline"}
          size={20}
          color={color}
        />
      );
    case "Playlists":
      return (
        <Ionicons
          name={focused ? "albums" : "albums-outline"}
          size={20}
          color={color}
        />
      );
    case "Settings":
      return (
        <Ionicons
          name={focused ? "settings" : "settings-outline"}
          size={20}
          color={color}
        />
      );
    default:
      return null;
  }
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  const tabOptions = ({
    route,
  }: {
    route: { name: keyof TabParamList };
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: Colors.icon,
    tabBarStyle: [
      styles.tabBar,
      {
        height: Layout.tabBarHeight + insets.bottom,
        paddingBottom: Math.max(insets.bottom, Spacing.sm),
      },
    ],
    tabBarLabelStyle: styles.label,
    tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
  });

  const renderTabBar = ({ state, navigation }: BottomTabBarProps) => (
    <View
      style={[
        styles.tabShell,
        { paddingBottom: Math.max(insets.bottom, Spacing.sm) },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const color = focused ? Colors.textPrimary : Colors.textSecondary;

          return (
            <Pressable
              key={route.key}
              style={styles.tabButton}
              onPress={() => navigation.navigate(route.name)}
            >
              <View style={[styles.iconPill, focused && styles.iconPillActive]}>
                {getTabIcon(route.name as keyof TabParamList, focused)}
              </View>
              <Text style={[styles.tabLabel, { color }]}>
                {TAB_LABELS[route.name as keyof TabParamList]}
              </Text>
              {focused && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Tab.Navigator screenOptions={tabOptions} tabBar={renderTabBar}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Library" component={LibraryScreen} />
        <Tab.Screen name="Playlists" component={PlaylistsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabShell: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
  },
  tabBar: {
    backgroundColor: "rgba(28, 22, 40, 0.96)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconPill: {
    width: 42,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: Colors.primaryGlow,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: Typography.medium,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tabBarHidden: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.sm,
  },
  label: {
    fontSize: Typography.xs,
  },
});
