// frontend/src/app/(chat)/page.tsx

"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_MESSAGES } from "@/lib/graphql/queries";
import { CREATE_MESSAGE } from "@/lib/graphql/mutations";
import { useChat } from "@/context/ChatContext";
import { useState, useRef, useEffect } from "react";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { Box, CircularProgress, Alert } from "@mui/material";

export default function ChatPage() {
  const { currentUser } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { loading, error, data, fetchMore } = useQuery(GET_MESSAGES, {
    variables: { limit: 20 },
    fetchPolicy: "network-only",
  });

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update(cache, { data: { createMessage } }) {
      cache.modify({
        fields: {
          messages(existingMessages = []) {
            return [createMessage, ...existingMessages];
          },
        },
      });
    },
  });

  const handleSend = async () => {
    if (newMessage.trim()) {
      await createMessage({
        variables: { input: { message: newMessage.trim(), author: currentUser } },
      });
      setNewMessage("");
    }
  };

  const handleLoadMore = () => {
    if (data?.messages?.length) {
      const lastMessage = data.messages[data.messages.length - 1];
      fetchMore({
        variables: { after: lastMessage.createdAt },
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  return (
    <Box className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg">
      <ChatHeader />

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

        <MessageList
          messages={data?.messages || []}
          onLoadMore={handleLoadMore}
          hasMore={data?.messages?.length >= 20}
          loadingMore={loading}
        />

        <div ref={messagesEndRef} />
      </Box>

      <MessageInput value={newMessage} onChange={setNewMessage} onSend={handleSend} disabled={loading} />
    </Box>
  );
}
