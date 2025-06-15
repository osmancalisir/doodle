// frontend/src/components/chat/DeleteRoomDialog.tsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

interface DeleteRoomDialogProps {
  open: boolean;
  roomName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteRoomDialog({
  open,
  roomName,
  onClose,
  onConfirm,
  loading = false,
}: DeleteRoomDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Room</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to permanently delete the room {roomName}?
          <br />
          <strong>This action cannot be undone.</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Deleting..." : "Delete Room"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
