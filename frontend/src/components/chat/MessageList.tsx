// frontend/src/components/chat/MessageList.tsx

import React, { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Message } from "@/lib/types/message";

interface MessageListProps {
  messages: Message[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  currentUser?: string;
}

export default function MessageList({
  messages = [],
  onLoadMore = () => {},
  hasMore = false,
  loadingMore = false,
  currentUser = "",
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      className="flex flex-col"
      sx={{
        minHeight: "100%",
        padding: "16px 12px",
        background: "#f9fafb",
      }}
    >
      {hasMore && (
        <Box className="flex justify-center my-3">
          <Button
            variant="outlined"
            onClick={onLoadMore}
            disabled={loadingMore}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              borderColor: "primary.main",
              color: "primary.main",
              padding: "6px 20px",
              fontSize: "0.85rem",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "primary.light",
                borderColor: "primary.dark",
                color: "primary.contrastText",
              },
              "&:disabled": {
                borderColor: "action.disabled",
                color: "action.disabled",
              },
            }}
          >
            {loadingMore ? <CircularProgress size={20} sx={{ color: "primary.main", mr: 1 }} /> : null}
            {loadingMore ? "Loading..." : "Load older messages"}
          </Button>
        </Box>
      )}

      {messages.length === 0 && !loadingMore && (
        <Box className="flex flex-col justify-center items-center h-full text-center p-4">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Box>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            No messages yet
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: "300px" }}>
            Be the first to start the conversation!
          </Typography>
        </Box>
      )}

      {messages.map((message) => (
        <MessageItem key={message.id} message={message} currentUser={currentUser} />
      ))}

      <div ref={messagesEndRef} />
    </Box>
  );
}
