// frontend/src/app/chat/[roomId]/page.tsx

"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_MESSAGES } from "@/lib/graphql/typeDefs";
import { CREATE_MESSAGE } from "@/lib/graphql/mutations";
import { useChat } from "@/context/ChatContext";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { Box, CircularProgress, Alert, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const isValidRoomId = typeof roomId === "string" && roomId.length > 0;

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { roomId, limit: 20 },
    fetchPolicy: "network-only",
    skip: !isValidRoomId,
  });

  const [createMessage, { loading: sending }] = useMutation(CREATE_MESSAGE, {
    onError: (err) => {
      console.error("Message send error:", err);
      setSendError(err.message);
    },
  });

  const handleSend = async () => {
    if (!isValidRoomId) {
      setSendError("Invalid room ID");
      return;
    }

    if (newMessage.trim() && currentUser) {
      setSendError(null);
      try {
        await createMessage({
          variables: {
            input: {
              message: newMessage.trim(),
              author: currentUser,
              roomId,
            },
          },
        });
        setNewMessage("");
      } catch (err) {
        console.error("Failed to send message:", err);
        setSendError("Failed to send message");
      }
    }
  };

  useEffect(() => {
    if (data?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.messages]);

  if (!isValidRoomId) {
    return (
      <Box className="flex justify-center items-center h-full">
        <Alert severity="error">Invalid room ID</Alert>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-full">
      <Box className="border-b border-gray-200">
        <ChatHeader />

        <Box className="px-4 py-2 flex items-center justify-between bg-gray-50">
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/chat")} size="small">
            All Chats
          </Button>
          <Typography variant="subtitle2" className="font-medium">
            Room ID: {roomId}
          </Typography>
        </Box>
      </Box>

      <Box className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading && !data && (
          <Box className="flex justify-center p-4">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" className="my-4">
            Failed to load messages: {error.message}
          </Alert>
        )}

        {sendError && (
          <Alert severity="error" className="my-4">
            {sendError}
          </Alert>
        )}

        <MessageList messages={data?.messages || []} hasMore={false} loadingMore={false} onLoadMore={() => {}} />

        <div ref={messagesEndRef} />
      </Box>

      <MessageInput value={newMessage} onChange={setNewMessage} onSend={handleSend} disabled={sending || loading} />
    </Box>
  );
}
