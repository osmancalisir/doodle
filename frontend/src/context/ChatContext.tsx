// frontend/src/context/ChatContext.tsx

import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";

interface ChatState {
  currentUser: string;
  activeRoom: string | null;
}

type ChatAction =
  | { type: "SET_USER"; payload: string }
  | { type: "SET_ACTIVE_ROOM"; payload: string | null }
  | { type: "HYDRATE"; payload: Partial<ChatState> };

const initialState: ChatState = {
  currentUser: "You",
  activeRoom: null,
};

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, currentUser: action.payload };

    case "SET_ACTIVE_ROOM":
      return {
        ...state,
        activeRoom: action.payload,
      };

    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem("chatState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: "HYDRATE", payload: parsed });
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatState", JSON.stringify(state));
  }, [state]);

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
