// frontend/src/components/chat/MessageList.tsx

import React, { useState, useRef, useEffect } from "react";
import MessageItem from "./MessageItem";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Message } from "@/lib/types/message";

interface MessageListProps {
  messages: Message[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

export default function MessageList({ messages, onLoadMore, hasMore, loadingMore }: MessageListProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef(messages.length);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    setAutoScroll(atBottom);
  };

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      setAutoScroll(true);
    }
    prevMessageCount.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView();
    }
  }, []);

  return (
    <Box
      className="flex flex-col-reverse"
      onScroll={handleScroll}
      ref={listRef}
      sx={{
        height: "100%",
        overflowY: "auto",
        padding: "16px 12px",
        background: "linear-gradient(to bottom, #f9fafb, #f0f4f8)",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c5c7d0",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#a8abb4",
          },
        },
      }}
    >
      <div ref={messagesEndRef} />

      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

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
    </Box>
  );
}
