// frontend/src/app/chat/page.tsx

"use client";

import { useQuery } from "@apollo/client";
import { GET_ROOMS } from "@/lib/graphql/typeDefs";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, CircularProgress, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function ChatHomePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ROOMS);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Box className="max-w-3xl w-full">
        <Box className="flex justify-between items-center mb-8">
          <Typography variant="h4" className="font-bold">
            Your Chat Rooms
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push("/chat/new")}>
            Create Room
          </Button>
        </Box>

        {loading && (
          <Box className="flex justify-center py-12">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box className="bg-red-50 p-4 rounded-lg mb-6">
            <Typography color="error">Error loading rooms: {error.message}</Typography>
          </Box>
        )}

        {data?.rooms?.length > 0 ? (
          <Grid container spacing={3}>
            {data.rooms.map((room: any) => (
              // item xs={12} sm={6} md={4}
              <Grid key={room.id}>
                <Box
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer h-full"
                  onClick={() => router.push(`/chat/${room.id}`)}
                >
                  <Box className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-blue-600 text-xl">#</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold mb-2">
                    {room.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(room.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2">
                    ID: {room.id}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading && (
            <Box className="text-center py-12">
              <Box className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <AddIcon className="text-gray-400 text-4xl" />
              </Box>
              <Typography variant="h5" className="mb-4">
                No chat rooms yet
              </Typography>
              <Typography className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by creating a new chat room where you can invite others to join the conversation.
              </Typography>
              <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => router.push("/chat/new")}>
                Create Your First Room
              </Button>
            </Box>
          )
        )}
      </Box>
    </div>
  );
}
