import { createContext, useContext } from "react";
import type { Theme } from "@mui/material/styles";
import type { ThemeMode } from "../utils/types";

export interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  theme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return ctx;
}
