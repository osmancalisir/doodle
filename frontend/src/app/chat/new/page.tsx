// frontend/src/app/chat/new/page.tsx

"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_ROOM } from "@/lib/graphql/typeDefs";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { client } from "@/lib/graphql/client";
import { GET_ROOMS } from "@/lib/graphql/typeDefs";

export default function NewRoomPage() {
  const [roomName, setRoomName] = useState("");
  const [createRoom, { loading, error: mutationError }] = useMutation(CREATE_ROOM);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!roomName.trim()) {
      setError("Room name cannot be empty");
      return;
    }

    try {
      const { data } = await createRoom({
        variables: {
          input: {
            name: roomName.trim(),
          },
        },
        update: (cache, { data: mutationData }) => {
          const existingRooms = cache.readQuery<{ rooms: any[] }>({
            query: GET_ROOMS,
          });

          if (existingRooms && mutationData?.createRoom) {
            cache.writeQuery({
              query: GET_ROOMS,
              data: {
                rooms: [mutationData.createRoom, ...existingRooms.rooms],
              },
            });
          }
        },
      });

      if (data?.createRoom?.id) {
        client.refetchQueries({ include: [GET_ROOMS] });
        router.push(`/chat/${data.createRoom.id}`);
      }
    } catch (err: any) {
      console.error("Room creation failed:", err);
      setError(err.message || "Failed to create room");
    }
  };

  return (
    <Box className="flex items-center justify-center h-full">
      <Box className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <Typography variant="h5" className="font-bold mb-2">
          Create New Chat Room
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mb-6">
          Start a new conversation with your team or friends
        </Typography>

        {(error || mutationError) && (
          <Alert severity="error" className="mb-4">
            {error || mutationError?.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            margin="normal"
            disabled={loading}
            error={Boolean(error)}
            helperText={error}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
