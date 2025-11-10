import { useColorScheme as _useColorScheme } from "react-native";

export const useColorScheme = (): "light" | "dark" => {
  const scheme = _useColorScheme();
  return scheme === "dark" ? "dark" : "light";
};
