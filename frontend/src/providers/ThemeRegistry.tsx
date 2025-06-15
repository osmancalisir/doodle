// frontend/src/providers/ThemeRegistry.tsx

"use client";

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/lib/theme";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/graphql/client";
import { ChatProvider } from "@/context/ChatContext";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ChatProvider>{children}</ChatProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
