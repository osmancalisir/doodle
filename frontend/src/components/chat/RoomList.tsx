// frontend/src/components/chat/RoomList.tsx

"use client";

import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_ROOM, GET_ROOMS } from "@/lib/graphql/typeDefs";
import { DELETE_ROOM } from "@/lib/graphql/mutations";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Skeleton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import DeleteRoomDialog from "./DeleteRoomDialog";
import { useChat } from "@/context/ChatContext";

export default function RoomList() {
  const { data } = useQuery(GET_ROOMS);
  const [createRoom] = useMutation(CREATE_ROOM);
  const [deleteRoom] = useMutation(DELETE_ROOM);
  const [newRoomName, setNewRoomName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, setCurrentUser } = useChat();

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

  const filteredRooms =
    data?.rooms?.filter((room: { name: string }) => room.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

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
    <Box className="h-full flex flex-col bg-gray-50">
      <Box className="p-4 border-b bg-white">
        <Typography variant="h6" className="font-bold mb-4">
          Chat Rooms
        </Typography>

        <Box className="flex mb-4 bg-gray-100 rounded-lg px-3 py-2 gap-3">
          <input
            type="text"
            placeholder="Search rooms..."
            className="bg-transparent w-full focus:outline-none h-[36px] py-1.5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: "0.95rem",
              flexShrink: 0,
            }}
            onClick={() => {
              const newName = prompt("Enter your name", currentUser);
              if (newName) setCurrentUser(newName);
            }}
          >
            {currentUser.charAt(0)}
          </Avatar>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
          sx={{ mb: 2 }}
        >
          New Room
        </Button>
      </Box>

      <Box className="flex-1 overflow-y-auto">
        <List sx={{ py: 0 }}>
          {filteredRooms.map((room: any) => (
            <ListItem
              key={room.id}
              component={Link}
              href={`/chat/${room.id}`}
              className="hover:bg-gray-100 cursor-pointer border-b border-gray-100"
              sx={{ py: 1.5 }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.light", width: 36, height: 36 }}>
                  <GroupIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={room.name}
                secondary={`ID: ${room.id.slice(0, 8)}...`}
                primaryTypographyProps={{ fontWeight: "medium" }}
                secondaryTypographyProps={{ variant: "caption" }}
                sx={{ my: 0 }}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteClick(room);
                }}
                sx={{ color: "text.secondary" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
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
