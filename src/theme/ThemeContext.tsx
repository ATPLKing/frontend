import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeContext } from "./theme-context";
import type { ThemeContextValue } from "./theme-context";
import type { ThemeMode } from "../utils/types";

const STORAGE_KEY = "themeInfo";

function loadMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        (parsed[0] === "dark" || parsed[0] === "light")
      ) {
        return parsed[0];
      }
      if (parsed === "dark" || parsed === "light") {
        return parsed;
      }
    } catch {
      // fall through to default
    }
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(loadMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0474C4" },
          secondary: { main: "#0d2467" },
          success: { main: "#3e8e41" },
          error: { main: "#ff745e" },
          background:
            mode === "dark"
              ? { default: "#202123", paper: "#3a3a3a" }
              : { default: "#ffffff", paper: "#ffffff" },
        },
        shape: { borderRadius: 8 },
        typography: {
          fontFamily: "'Roboto', sans-serif",
        },
      }),
    [mode]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggleMode: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      theme,
    }),
    [mode, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
