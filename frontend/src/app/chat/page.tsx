// frontend/src/app/chat/page.tsx

"use client";

import { useQuery } from "@apollo/client";
import { GET_ROOMS } from "@/lib/graphql/typeDefs";
import { useRouter } from "next/navigation";
import { Button, Box, Typography, Grid, Card, CardActionArea, CardContent, Avatar, Skeleton } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ChatHomePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ROOMS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Box className="max-w-6xl mx-auto">
        <Typography variant="h4" className="font-bold text-gray-800" style={{ marginBottom: 20 }}>
          Your Chat Rooms
        </Typography>

        {loading && (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rounded" height={180} animation="wave" />
              </Grid>
            ))}
          </Grid>
        )}

        {error && (
          <Box className="bg-red-50 p-6 rounded-xl mb-6 flex flex-col items-center text-center max-w-2xl mx-auto">
            <ErrorOutlineIcon className="text-red-500 mb-4" style={{ fontSize: 64 }} />
            <Typography variant="h6" className="font-medium text-red-700 mb-2">
              Failed to load rooms
            </Typography>
            <Typography color="text.secondary" className="mb-4">
              {error.message || "Please try again later"}
            </Typography>
            <Button variant="outlined" color="error" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Box>
        )}

        {data?.rooms?.length > 0 && (
          <Grid container spacing={3}>
            {data.rooms.map((room: any) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={room.id}>
                <Card
                  className="h-full rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  sx={{
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    "&:hover": {
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => router.push(`/chat/${room.id}`)} className="h-full">
                    <CardContent className="flex flex-col h-full p-5">
                      <Box className="flex items-center mb-4">
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            width: 56,
                            height: 56,
                            mr: 2,
                          }}
                        >
                          <GroupsIcon fontSize="medium" />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" className="font-bold truncate max-w-[120px]">
                            {room.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(room.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mt-auto bg-gray-50 p-2 rounded-lg text-xs font-mono truncate"
                      >
                        ID: {room.id}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </div>
  );
}
