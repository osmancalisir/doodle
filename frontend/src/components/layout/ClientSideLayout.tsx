// frontend/src/components/layout/ClientSideLayout.tsx

"use client";

import React, { useState, useEffect } from "react";
import RoomList from "@/components/chat/RoomList";
import { Skeleton } from "@mui/material";

export default function ClientSideLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
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
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-gray-200 bg-white shadow-sm">
        <RoomList />
      </div>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
