// frontend/src/components/chat/MessageItem.tsx

import { useChat } from "@/context/ChatContext";
import { Avatar, Box, Typography } from "@mui/material";
import { format } from "date-fns";

interface MessageItemProps {
  message: {
    id: string;
    author: string;
    message: string;
    createdAt: string;
  };
}

export default function MessageItem({ message }: MessageItemProps) {
  const { currentUser } = useChat();
  const isCurrentUser = message.author === currentUser;

  return (
    <Box
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      sx={{
        maxWidth: "85%",
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
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
          backgroundColor: isCurrentUser ? "#3f51b5" : "#f3f4f6",
          color: isCurrentUser ? "white" : "text.primary",
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
              color: "text.primary",
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
            color: isCurrentUser ? "rgba(255,255,255,0.7)" : "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          {format(new Date(message.createdAt), "HH:mm")}
        </Typography>
      </Box>
    </Box>
  );
}
