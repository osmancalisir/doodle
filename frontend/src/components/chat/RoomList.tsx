// frontend/src/components/chat/RoomList.tsx

"use client";

import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_ROOM, GET_ROOMS } from "@/lib/graphql/typeDefs";
import { DELETE_ROOM } from "@/lib/graphql/mutations";
import { useChat } from "@/context/ChatContext";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import DeleteRoomDialog from "./DeleteRoomDialog";

export default function RoomList() {
  const { currentUser } = useChat();
  const { data, refetch } = useQuery(GET_ROOMS);
  const [createRoom] = useMutation(CREATE_ROOM, {
    onCompleted: () => refetch(),
  });
  const [deleteRoom] = useMutation(DELETE_ROOM);
  const [newRoomName, setNewRoomName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom({
        variables: {
          input: {
            name: newRoomName.trim(),
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
      setNewRoomName("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteClick = (room: any) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;

    setDeleting(true);
    try {
      await deleteRoom({
        variables: { roomId: roomToDelete.id },
        update: (cache) => {
          const existingRooms = cache.readQuery<{ rooms: any[] }>({
            query: GET_ROOMS,
          });

          if (existingRooms) {
            cache.writeQuery({
              query: GET_ROOMS,
              data: {
                rooms: existingRooms.rooms.filter((room) => room.id !== roomToDelete.id),
              },
            });
          }
        },
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting room:", error);
    } finally {
      setDeleting(false);
      setRoomToDelete(null);
    }
  };

  if (!isMounted) {
    return (
      <div className="p-4">
        <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 2 }} />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rounded" width="100%" height={70} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Box className="h-full flex flex-col">
      <Box className="p-4 border-b">
        <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
          New Chat Room
        </Button>
      </Box>

      <Box className="flex-1 overflow-y-auto">
        <List>
          {data?.rooms?.map((room: any) => (
            <ListItem
              key={room.id}
              component={Link}
              href={`/chat/${room.id}`}
              className="hover:bg-gray-100 cursor-pointer border-b border-gray-100"
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <GroupIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={room.name}
                secondary={`Created: ${new Date(room.createdAt).toLocaleDateString()}`}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(room);
                }}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box className="p-4 border-t flex items-center bg-gray-50">
        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>{currentUser.charAt(0)}</Avatar>
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {currentUser}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Online
          </Typography>
        </Box>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Create New Chat Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRoom} variant="contained" disabled={!newRoomName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteRoomDialog
        open={deleteDialogOpen}
        roomName={roomToDelete?.name || ""}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </Box>
  );
}
