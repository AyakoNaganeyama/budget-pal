import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState } from "react-native";
import "react-native-reanimated";
import { supabase } from "../util/supabase"; // adjust path

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    // 1️⃣ Handle auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🟡 Auth state changed:", event);

        if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session) {
          router.replace("./(auth)/login"); // your single user route
        }

        if (event === "SIGNED_OUT" || !session) {
          router.replace("/(tabs)"); // redirect to login/welcome
        }
      }
    );

    // 2️⃣ Handle app state for auto-refresh
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
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
