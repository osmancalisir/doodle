// frontend/src/app/layout.tsx

"use client";

import React, { useState, useEffect, ReactNode } from "react";
import ThemeProvider from "@/providers/ThemeProvider";
import ApolloClientProvider from "@/providers/ApolloProvider";
import { ChatProvider } from "@/context/ChatContext";
import { usePathname } from "next/navigation";
import RoomList from "@/components/chat/RoomList";
import { Box } from "@mui/material";
import "./globals.css";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="en">
        <body className="h-screen flex">
          <div className="w-64 bg-gray-50 p-4 border-r">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <main className="flex-1 flex flex-col">
            <div className="h-16 bg-white border-b"></div>
            <div className="flex-1 bg-gray-100"></div>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <ApolloClientProvider>
          <ThemeProvider>
            <ChatProvider>
              <Box sx={{ display: "flex" }}>
                {pathname.startsWith("/chat") && <RoomList />}

                <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - 280px)` } }}>
                  {children}
                </Box>
              </Box>
            </ChatProvider>
          </ThemeProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
