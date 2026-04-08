// app/(tabs)/_layout.tsx
// This file sets up the bottom tab navigator for the 4 main screens.
// We plug in our custom TabBar component here instead of the default one.

import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import MiniPlayer from "../../components/MiniPlayer";
import TabBar from "../../components/TabBar";
import { Colors } from "../../constants/theme";

export default function TabLayout() {
  return (
    // Wrapper so MiniPlayer can float above the TabBar
    <View style={styles.container}>
      <Tabs
        // Replace the default tab bar with our custom one
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          // Hide the default header on every screen
          headerShown: false,
        }}
      >
        {/* Each Tabs.Screen maps to a file in app/(tabs)/ */}
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="library" options={{ title: "Library" }} />
        <Tabs.Screen name="playlists" options={{ title: "Playlists" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>

      {/* MiniPlayer floats above the tab bar on every screen */}
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
