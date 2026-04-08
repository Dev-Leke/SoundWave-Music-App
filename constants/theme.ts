// constants/theme.ts
// Central design system — all colors, typography, spacing, and radii
// Import this wherever you need consistent styling across the app

export const Colors = {
  // Core backgrounds (matches dark Figma design)
  background: "#0D0D0D", // deepest background
  surface: "#1A1A1A", // cards, list items
  surfaceAlt: "#222222", // slightly lighter surface (inputs, toggles bg)
  elevated: "#2A2A2A", // modals, bottom sheets

  // Brand / accent
  primary: "#7C4DFF", // purple — buttons, active states, progress bar
  primaryDark: "#5B2ECC", // pressed / darker purple
  primaryGlow: "rgba(124, 77, 255, 0.25)", // glow effect behind album art etc.

  // Text
  textPrimary: "#FFFFFF", // main text
  textSecondary: "#A0A0A0", // subtitles, metadata
  textMuted: "#555555", // placeholders, disabled

  // UI elements
  border: "#2C2C2C", // dividers, card borders
  icon: "#A0A0A0", // inactive icons
  iconActive: "#FFFFFF", // active tab icons

  // Semantic
  success: "#4CAF50",
  error: "#F44336",

  // Gradients (used with expo-linear-gradient)
  gradientNowPlaying: ["#1A0533", "#0D0D0D"] as const,
  gradientCard: ["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"] as const,
  gradientTabBar: ["rgba(13,13,13,0)", "rgba(13,13,13,1)"] as const,
};

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 32,

  // Font weights (React Native uses string values)
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
};

export const Radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const Layout = {
  tabBarHeight: 64,
  miniPlayerHeight: 64,
  bottomInset: 90, // miniPlayer + some padding — used to offset FlatList contentInset
  screenPadding: 16,
};
