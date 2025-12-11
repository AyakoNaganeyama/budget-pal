import { createNavTheme } from "@/constants/theme";
import { ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import "react-native-reanimated";
import { supabase } from "../util/supabase";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = createNavTheme(colorScheme);
  const router = useRouter();

  useEffect(() => {
    // Handle auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🟡 Auth state changed:", event);

        if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session) {
          router.replace("/(tabs)");
        }

        if (event === "SIGNED_OUT" || !session) {
          router.replace("/(auth)/login"); // redirect to login/welcome
        }
      }
    );

    // Handle app state for auto-refresh
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });

    // Cleanup on unmount
    return () => {
      authListener.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
