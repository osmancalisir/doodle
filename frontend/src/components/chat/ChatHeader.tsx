// frontend/src/components/chat/ChatHeader.tsx

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";

export default function ChatHeader() {
  const router = useRouter();
  const { dispatch } = useChat();

  const handleBackClick = () => {
    dispatch({ type: "SET_ACTIVE_ROOM", payload: null });
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
        <Typography variant="h6" className="font-bold">
          Chat Room
        </Typography>
      </Box>
    </Box>
  );
}
