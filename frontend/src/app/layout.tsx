// frontend/src/app/layout.tsx

import React from "react";
import type { Metadata } from "next";
import ThemeProvider from "@/providers/ThemeProvider";
import ApolloClientProvider from "@/providers/ApolloProvider";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "Doodle Chat",
  description: "Real-time chat application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloClientProvider>
          <ThemeProvider>
            <ChatProvider>
              {" "}
              {/* Wrap with context provider */}
              {children}
            </ChatProvider>
          </ThemeProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
