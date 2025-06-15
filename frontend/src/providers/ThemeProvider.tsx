// frontend/src/providers/ThemeProvider.tsx

"use client";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "@/lib/theme";
import { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
