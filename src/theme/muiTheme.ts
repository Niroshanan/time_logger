
import { createTheme } from "@mui/material/styles";

export const createAppTheme = (mode: "light" | "dark") => {
  const colors = {
    light: {
      background: "#e4e4e4",
      surface: "#cfcfcf",
      foreground: "#0f172a",
      muted: "#64748b",
      primary: "#6687b6",
      border: "#b8bdc4",
      input: "#d4d4d4",
      danger: "#dc2626",
    },
    dark: {
      background: "#0f172a",
      surface: "#1e293b",
      foreground: "#f1f5f9",
      muted: "#94a3b8",
      primary: "#6687b6",
      border: "#334155",
      input: "#1e293b",
      danger: "#f87171",
    },
  }[mode];

  return createTheme({
    palette: {
      mode,
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.foreground,
        secondary: colors.muted,
      },
      primary: {
        main: colors.primary,
      },
      error: {
        main: colors.danger,
      },
      divider: colors.border,
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: colors.input,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.border,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.muted,
            },
          },
        },
      },
    },
  });
};
