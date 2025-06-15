// frontend/src/components/chat/MessageInput.tsx

import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoodIcon from "@mui/icons-material/Mood";
import MicIcon from "@mui/icons-material/Mic";

interface MessageInputProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function MessageInput({ value, onChange, onSend, disabled }: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const handleComposition = (e: React.CompositionEvent) => {
    if (e.type === "compositionend") {
      setIsComposing(false);
    } else {
      setIsComposing(true);
    }
  };

  return (
    <Box
      className="border-t border-gray-200 p-3"
      sx={{
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.03)",
        backgroundColor: "background.paper",
      }}
    >
      <Box className="flex items-end">
        <Tooltip title="Attach file">
          <IconButton className="mr-1 self-center" disabled={disabled} sx={{ color: "text.secondary" }}>
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Emoji">
          <IconButton className="mr-1 self-center" disabled={disabled} sx={{ color: "text.secondary" }}>
            <MoodIcon />
          </IconButton>
        </Tooltip>

        <TextField
          multiline
          maxRows={6}
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputRef={textareaRef}
          disabled={disabled}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              padding: "8px 16px",
              backgroundColor: "action.hover",
              transition: "all 0.3s",
              borderWidth: "1px",
              borderColor: isFocused ? "primary.main" : "divider",
              "&:hover": {
                backgroundColor: "action.selected",
              },
              "&.Mui-focused": {
                backgroundColor: "background.paper",
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              },
            },
            "& .MuiInputBase-input": {
              padding: "0",
              maxHeight: "150px",
              overflowY: "auto",
              fontSize: "0.95rem",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c5c5c5",
                borderRadius: "3px",
              },
            },
          }}
        />

        {value.trim() ? (
          <Tooltip title="Send message">
            <IconButton
              className="ml-2 self-center"
              onClick={onSend}
              disabled={disabled}
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "&:disabled": {
                  backgroundColor: "action.disabledBackground",
                  color: "action.disabled",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Voice message">
            <IconButton
              className="ml-2 self-center"
              disabled={disabled}
              sx={{
                backgroundColor: "action.hover",
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <MicIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
