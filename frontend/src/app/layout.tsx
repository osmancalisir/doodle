// frontend/src/app/layout.tsx

"use client";

import React, { useState, useEffect } from "react";
import ThemeProvider from "@/providers/ThemeProvider";
import ApolloClientProvider from "@/providers/ApolloProvider";
import { ChatProvider } from "@/context/ChatContext";
import RoomList from "@/components/chat/RoomList";
import { Skeleton } from "@mui/material";
import { usePathname } from "next/navigation";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="en">
        <body>
          <div className="flex h-screen">
            <div className="w-64 border-r border-gray-200 bg-white shadow-sm p-4">
              <div className="space-y-4">
                <Skeleton variant="rounded" width="100%" height={70} />
                <Skeleton variant="rounded" width="100%" height={70} />
                <Skeleton variant="rounded" width="100%" height={70} />
              </div>
            </div>
            <main className="flex-1 flex flex-col">
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </main>
          </div>
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
              <div className="flex h-screen">
                {/* Only show sidebar on chat routes */}
                {pathname.startsWith("/chat") && (
                  <div className="w-64 border-r border-gray-200 bg-white shadow-sm">
                    <RoomList />
                  </div>
                )}
                <main className="flex-1 flex flex-col">{children}</main>
              </div>
            </ChatProvider>
          </ThemeProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
