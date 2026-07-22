import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material/styles";

// Warrior Precision design system — see
// ~/.cursor/skills/warrior-wl-styling/{SKILL,TOKENS,IMPLEMENTATION}.md.
// CTA / Warrior Red is always #FF3334 in both themes, even though the
// Material-derived "primary" role differs per mode.
const CTA = "#FF3334";

type SurfaceContainerTiers = {
  lowest: string;
  low: string;
  main: string;
  high: string;
  highest: string;
};

declare module "@mui/material/styles" {
  interface Palette {
    surfaceContainer: SurfaceContainerTiers;
  }
  interface PaletteOptions {
    surfaceContainer?: SurfaceContainerTiers;
  }
}

const surfaceContainers: Record<PaletteMode, SurfaceContainerTiers> = {
  light: {
    lowest: "#ffffff",
    low: "#f1f4f6",
    main: "#ebeef0",
    high: "#e5e9eb",
    highest: "#e0e3e5",
  },
  dark: {
    lowest: "#0b0f10",
    low: "#181c1e",
    main: "#1c2022",
    high: "#262b2c",
    highest: "#313537",
  },
};

const sharedTypography = {
  fontFamily: '"Exo 2", sans-serif',
  h1: { fontSize: "56px", lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.02em" },
  h2: { fontSize: "32px", lineHeight: 1.3, fontWeight: 600 },
  h3: { fontSize: "24px", lineHeight: 1.4, fontWeight: 600 },
  body1: { fontSize: "18px", lineHeight: 1.6, fontWeight: 400 },
  body2: { fontSize: "16px", lineHeight: 1.5, fontWeight: 400 },
  button: { fontSize: "14px", lineHeight: 1, fontWeight: 600, letterSpacing: "0.05em" },
  overline: { fontSize: "14px", lineHeight: 1, fontWeight: 600, letterSpacing: "0.05em" },
};

const lightOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: { main: CTA },
    error: { main: "#ba1a1a" },
    background: { default: "#f7fafc", paper: "#ffffff" },
    text: { primary: "#181c1e", secondary: "#5d3f3c" },
    divider: "#e0e3e5",
    surfaceContainer: surfaceContainers.light,
  },
  shape: { borderRadius: 8 },
  spacing: 4,
  typography: sharedTypography,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 48, boxShadow: "none" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #181c1e33",
          borderRadius: 16,
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
};

const darkOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: { main: CTA },
    error: { main: "#ffb4ab" },
    background: { default: "#101416", paper: "#0b0f10" },
    text: { primary: "#e0e3e5", secondary: "#e7bdb8" },
    divider: "#313537",
    surfaceContainer: surfaceContainers.dark,
  },
  shape: { borderRadius: 8 },
  spacing: 4,
  typography: sharedTypography,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 48, boxShadow: "none" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #ae8884",
          borderRadius: 16,
          boxShadow: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
};

export const getAppTheme = (mode: PaletteMode) =>
  createTheme(mode === "light" ? lightOptions : darkOptions);
