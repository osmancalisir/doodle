// frontend/src/context/ChatContext.tsx

"use client";

import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
  currentUser: string;
  // eslint-disable-next-line no-unused-vars
  setCurrentUser: (user: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  currentUser: "You",
  setCurrentUser: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState("You");

  return <ChatContext.Provider value={{ currentUser, setCurrentUser }}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
