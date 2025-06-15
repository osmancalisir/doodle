// frontend/src/components/chat/ChatHeader.tsx

import React, { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { Box, Typography, IconButton, Menu, MenuItem, Avatar, TextField, Badge } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatHeader() {
  const { currentUser, setCurrentUser } = useChat();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(currentUser);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUsernameChange = () => {
    if (tempUsername.trim()) {
      setCurrentUser(tempUsername.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempUsername(currentUser);
    setIsEditing(false);
  };

  useEffect(() => {
    setTempUsername(currentUser);
  }, [currentUser]);

  return (
    <Box
      className="flex items-center justify-between p-3 border-b border-gray-200"
      sx={{
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        backgroundColor: "background.paper",
      }}
    >
      <Box className="flex items-center">
        <Typography variant="h6" className="font-bold" sx={{ color: "primary.main" }}>
          Doodle Chat
        </Typography>
      </Box>

      <Box className="flex items-center space-x-2">
        {isEditing ? (
          <Box className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1">
            <TextField
              size="small"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameChange()}
              autoFocus
              sx={{
                "& .MuiInputBase-input": {
                  padding: "4px 8px",
                  fontSize: "0.875rem",
                },
                width: "160px",
              }}
            />
            <IconButton onClick={handleUsernameChange} size="small" color="success" sx={{ ml: 0.5 }}>
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={cancelEdit} size="small" color="error">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box className="flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full pl-1 pr-3 py-1 shadow-sm">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              color="success"
              sx={{
                "& .MuiBadge-badge": {
                  boxShadow: "0 0 0 2px white",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  fontSize: "0.9rem",
                  mr: 1,
                }}
              >
                {currentUser.charAt(0)}
              </Avatar>
            </Badge>
            <Typography variant="body2" className="font-medium" sx={{ color: "text.primary" }}>
              {currentUser}
            </Typography>
          </Box>
        )}

        <IconButton
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            color: isEditing ? "primary.main" : "text.secondary",
            transition: "color 0.3s",
          }}
        >
          <SettingsIcon />
        </IconButton>

        <IconButton onClick={handleMenuOpen} sx={{ color: "text.secondary" }}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
              minWidth: "200px",
            },
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, fontSize: "0.9rem" }}>
            Clear chat history
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, fontSize: "0.9rem" }}>
            Notification settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, fontSize: "0.9rem" }}>
            Report a problem
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
