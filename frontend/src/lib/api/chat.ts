// frontend/src/lib/api/chat.ts

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CHAT_TOKEN = process.env.NEXT_PUBLIC_CHAT_TOKEN;

export const getMessages = async (params?: { after?: string; limit?: number }) => {
  const response = await axios.get(`${API_URL}/api/v1/messages`, {
    params,
    headers: {
      Authorization: `Bearer ${CHAT_TOKEN}`,
    },
  });
  return response.data;
};

export const sendMessage = async (message: { author: string; message: string }) => {
  const response = await axios.post(`${API_URL}/api/v1/messages`, message, {
    headers: {
      Authorization: `Bearer ${CHAT_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
