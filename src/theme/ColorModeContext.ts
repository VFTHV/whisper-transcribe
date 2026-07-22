import { createContext, useContext } from "react";
import type { PaletteMode } from "@mui/material";

type ColorModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within ThemeWrapper");
  }
  return context;
};
