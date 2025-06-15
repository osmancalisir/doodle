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
        transition: "transform 0.2s, opacity 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
        },
      }}
    >
      {!isCurrentUser && (
        <Avatar
          className="mr-2"
          sx={{
            bgcolor: "primary.light",
            width: 36,
            height: 36,
            alignSelf: "flex-end",
            mb: 0.5,
          }}
        >
          {message.author.charAt(0)}
        </Avatar>
      )}

      <Box
        className="rounded-xl p-3"
        sx={{
          borderRadius: "18px",
          borderBottomRightRadius: isCurrentUser ? "4px" : "18px",
          borderBottomLeftRadius: isCurrentUser ? "18px" : "4px",
          backgroundColor: isCurrentUser ? "primary.main" : "background.paper",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            [isCurrentUser ? "right" : "left"]: "-8px",
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: isCurrentUser ? "0 0 12px 12px" : "12px 0 0 12px",
            borderColor: isCurrentUser
              ? `transparent transparent ${isCurrentUser ? "#3f51b5" : "#f5f5f5"} transparent`
              : `transparent transparent transparent ${isCurrentUser ? "#3f51b5" : "#f5f5f5"}`,
          },
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
            color: isCurrentUser ? "primary.contrastText" : "text.primary",
            lineHeight: 1.4,
            wordBreak: "break-word",
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
            color: isCurrentUser ? "primary.light" : "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          {format(new Date(message.createdAt), "HH:mm")}
        </Typography>
      </Box>
    </Box>
  );
}
