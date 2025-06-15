// frontend/src/app/chat/[roomId]/error.tsx

"use client";

import { useEffect } from "react";
import { Button, Typography, Container } from "@mui/material";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Room error:", error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <Typography variant="h4" className="mb-4">
        Room Not Found
      </Typography>
      <Typography className="mb-6 text-center">
        The chat room you are trying to access does not exist or may have been removed.
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Try Again
      </Button>
      <Button variant="outlined" className="mt-4" href="/chat">
        Back to Rooms
      </Button>
    </Container>
  );
}
