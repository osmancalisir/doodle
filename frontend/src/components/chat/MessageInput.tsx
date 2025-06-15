// frontend/src/components/chat/MessageInput.tsx

import React, { useRef, useState, useEffect } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
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
      className="border-t border-gray-200 p-3 bg-white"
      sx={{
        boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box className="flex items-end">
        <TextField
          multiline
          maxRows={4}
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
          inputRef={textareaRef}
          disabled={disabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: "flex-end", mb: 0.5 }}>
                <IconButton
                  onClick={onSend}
                  disabled={disabled || !value.trim()}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "&:disabled": {
                      backgroundColor: "#e5e7eb",
                      color: "#9ca3af",
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              padding: "4px 8px",
              backgroundColor: "#f3f4f6",
              transition: "all 0.3s",
              "&.Mui-focused": {
                backgroundColor: "white",
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              },
            },
            "& .MuiInputBase-input": {
              padding: "8px 0",
              maxHeight: "100px",
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
      </Box>
    </Box>
  );
}
