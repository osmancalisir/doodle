// frontend/src/components/chat/MessageItem.tsx

import { Avatar, Box, Typography } from "@mui/material";
import { format } from "date-fns";

interface MessageItemProps {
  message: {
    id: string;
    author: string;
    message: string;
    createdAt: string;
  };
  currentUser?: string;
}

export default function MessageItem({ message, currentUser }: MessageItemProps) {
  const isCurrentUser = message.author === currentUser;
  const isTempMessage = message.id.startsWith("temp-");

  return (
    <Box
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      sx={{
        maxWidth: "85%",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
        padding: "4px 12px",
        opacity: isTempMessage ? 0.7 : 1,
      }}
    >
      {!isCurrentUser && (
        <Avatar
          className="mr-2"
          sx={{
            bgcolor: "#e5e7eb",
            width: 32,
            height: 32,
            alignSelf: "flex-start",
            mt: 0.5,
          }}
        >
          {message.author.charAt(0)}
        </Avatar>
      )}

      <Box
        sx={{
          borderRadius: "18px",
          padding: "12px 16px",
          backgroundColor: isCurrentUser ? "#4CAF50" : "#3f51b5",
          color: "white",
          borderBottomRightRadius: isCurrentUser ? "4px" : "18px",
          borderBottomLeftRadius: isCurrentUser ? "18px" : "4px",
          position: "relative",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {!isCurrentUser && (
          <Typography
            variant="subtitle2"
            className="font-bold"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 0.5,
            }}
          >
            {message.author}
          </Typography>
        )}
        <Typography
          sx={{
            lineHeight: 1.4,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.message}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            textAlign: "right",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.7rem",
          }}
        >
          {isTempMessage ? "Sending..." : format(new Date(message.createdAt), "HH:mm")}
        </Typography>
      </Box>
    </Box>
  );
}
