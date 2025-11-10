import { Theme } from "@react-navigation/native";

export const Colors = {
  light: {
    background: "#fff",
    text: "#000",
    cardBackground: "#f0f0f0",
    tint: "#007aff",
    inactive: "#8e8e93",
  },
  dark: {
     background: "#121212",      // softer dark instead of pure black
    text: "#ffffff",
    cardBackground: "#1e1e1e",  // slightly lighter than background
    tint: "#0a84ff",
    inactive: "#8e8e93",
  },
};

export const createNavTheme = (mode: "light" | "dark"): Theme => ({
  dark: mode === "dark",
  colors: {
    primary: Colors[mode].tint,
    background: Colors[mode].background,
    card: Colors[mode].cardBackground,
    text: Colors[mode].text,
    border: Colors[mode].inactive,
    notification: Colors[mode].tint,
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" },
    medium: { fontFamily: "System", fontWeight: "500" },
    bold: { fontFamily: "System", fontWeight: "700" },
    heavy: { fontFamily: "System", fontWeight: "900" },
  },
});
