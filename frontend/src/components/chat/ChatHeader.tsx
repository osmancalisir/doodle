// frontend/src/components/chat/ChatHeader.tsx

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  roomName?: string;
}

export default function ChatHeader({ roomName }: ChatHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/chat");
  };

  return (
    <Box
      className="flex items-center justify-between p-3 border-b border-gray-200"
      sx={{
        backgroundColor: "background.paper",
      }}
    >
      <Box className="flex items-center">
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        {roomName && (
          <Typography variant="h6" className="font-bold">
            {roomName}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
