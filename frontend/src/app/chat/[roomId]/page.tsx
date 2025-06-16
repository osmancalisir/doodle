// frontend/src/app/chat/[roomId]/page.tsx

"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_MESSAGES, CREATE_MESSAGE } from "@/lib/graphql/typeDefs";
import { useChat } from "@/context/ChatContext";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { Box, CircularProgress, Alert } from "@mui/material";

const sortMessages = (messages: any[]) => {
  return [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { state, dispatch } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const isValidRoomId = typeof roomId === "string" && roomId.length > 0;

  useEffect(() => {
    if (isValidRoomId) {
      dispatch({ type: "SET_ACTIVE_ROOM", payload: roomId });
    } else {
      router.push("/chat");
    }
  }, [roomId, isValidRoomId, dispatch, router]);

  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { roomId, limit: 50 },
    fetchPolicy: "network-only",
    skip: !isValidRoomId,
    pollInterval: 3000,
  });

  const allMessages = sortMessages(data?.messages || []);

  const [createMessage, { loading: sending }] = useMutation(CREATE_MESSAGE, {
    onError: (err) => {
      console.error("Message send error:", err);
      setSendError(err.message);
    },
    optimisticResponse: {
      __typename: "Mutation",
      createMessage: {
        __typename: "Message",
        id: `optimistic-${Date.now()}`,
        message: newMessage.trim(),
        author: state.currentUser,
        createdAt: new Date().toISOString(),
      },
    },
    update: (cache, { data: mutationData }) => {
      if (mutationData?.createMessage) {
        cache.updateQuery(
          {
            query: GET_MESSAGES,
            variables: { roomId, limit: 50 },
          },
          (existingData) => {
            if (!existingData) return;
            return {
              messages: [...existingData.messages, mutationData.createMessage],
            };
          }
        );
      }
    },
  });

  const handleSend = async () => {
    if (!isValidRoomId) {
      setSendError("Invalid room ID");
      return;
    }

    if (newMessage.trim() && state.currentUser) {
      setSendError(null);
      setNewMessage("");

      try {
        await createMessage({
          variables: {
            input: {
              message: newMessage.trim(),
              author: state.currentUser,
              roomId,
            },
          },
        });
      } catch (err) {
        console.error("Failed to send message:", err);
        setSendError("Failed to send message");
      }
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  if (!isValidRoomId) {
    return (
      <Box className="flex justify-center items-center h-full">
        <Alert severity="error">Invalid room ID</Alert>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-screen">
      <Box className="border-b border-gray-200">
        <ChatHeader />
      </Box>

      <Box
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50"
        sx={{
          height: "100%",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        {loading && allMessages.length === 0 && (
          <Box className="flex justify-center p-4">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" className="my-4 mx-4">
            Failed to load messages: {error.message}
          </Alert>
        )}

        {sendError && (
          <Alert severity="error" className="my-4 mx-4">
            {sendError}
          </Alert>
        )}

        <MessageList
          messages={allMessages}
          hasMore={false}
          loadingMore={false}
          onLoadMore={() => {}}
          currentUser={state.currentUser}
        />
      </Box>

      <MessageInput value={newMessage} onChange={setNewMessage} onSend={handleSend} disabled={sending || loading} />
    </Box>
  );
}
