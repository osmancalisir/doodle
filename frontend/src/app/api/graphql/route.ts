// frontend/src/app/api/graphql/route.ts

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import axios from "axios";
import { NextRequest } from "next/server";

const typeDefs = gql`
  type Message {
    id: ID!
    message: String!
    author: String!
    createdAt: String!
  }

  type Room {
    id: ID!
    name: String!
    createdAt: String!
  }

  input MessageInput {
    message: String!
    author: String!
    roomId: ID!
  }

  input RoomInput {
    name: String!
  }

  type Query {
    messages(roomId: ID!, after: String, limit: Int): [Message]
    rooms: [Room]
  }

  type Mutation {
    createMessage(input: MessageInput!): Message
    createRoom(input: RoomInput!): Room
  }
`;

const resolvers = {
  Query: {
    messages: async (_: any, { roomId, after, limit }: any) => {
      console.log(`[GraphQL] Fetching messages for room: ${roomId}`);
      try {
        if (!roomId || typeof roomId !== "string") {
          throw new Error("Invalid room ID");
        }

        const url = new URL(`${process.env.BACKEND_URL}/api/v1/messages/${roomId}`);
        if (after) url.searchParams.append("after", after);
        if (limit) url.searchParams.append("limit", String(limit));

        console.log("Request URL:", url.toString());

        const { data } = await axios.get(url.toString(), {
          headers: {
            Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
          },
        });
        return data;
      } catch (err: any) {
        console.error("Messages fetch error:", err.message);
        if (err.response) {
          console.error("Backend response:", err.response.data);
        }
        throw new Error(`Failed to fetch messages: ${err.message}`);
      }
    },
    rooms: async () => {
      console.log("[GraphQL] Fetching rooms");
      try {
        const { data } = await axios.get(`${process.env.BACKEND_URL}/api/v1/rooms`, {
          headers: {
            Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
          },
        });
        return data;
      } catch (err: any) {
        console.error("Rooms fetch error:", err.message);
        throw new Error(`Failed to fetch rooms: ${err.message}`);
      }
    },
  },
  Mutation: {
    createMessage: async (_: any, { input }: any) => {
      console.log(`[GraphQL] Creating message in room: ${input.roomId}`);
      try {
        if (!input.roomId || !input.message || !input.author) {
          throw new Error("Missing required fields");
        }

        const { data } = await axios.post(
          `${process.env.BACKEND_URL}/api/v1/messages/${input.roomId}`,
          { message: input.message, author: input.author },
          {
            headers: {
              Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        return data;
      } catch (err: any) {
        console.error("Message creation error:", err.message);
        if (err.response) {
          console.error("Backend response:", err.response.data);
        }
        throw new Error(`Failed to create message: ${err.response?.data?.error || err.message}`);
      }
    },
    createRoom: async (_: any, { input }: any) => {
      console.log("[GraphQL] Creating room:", input.name);
      try {
        if (!input.name) {
          throw new Error("Room name is required");
        }

        const { data } = await axios.post(
          `${process.env.BACKEND_URL}/api/v1/rooms`,
          { name: input.name },
          {
            headers: {
              Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        return {
          id: data.roomId,
          name: input.name,
          createdAt: new Date().toISOString(),
        };
      } catch (err: any) {
        console.error("Room creation error:", err.message);
        if (err.response) {
          console.error("Backend response:", err.response.data);
        }
        throw new Error(`Failed to create room: ${err.response?.data?.error || err.message}`);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError) => {
    console.error("GraphQL Error:", formattedError);
    return {
      ...formattedError,
      extensions: {
        ...formattedError.extensions,
        code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR",
      },
    };
  },
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

const graphqlHandler = async (req: NextRequest) => {
  try {
    const response = await handler(req);
    return response;
  } catch (err) {
    console.error("GraphQL handler error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const GET = graphqlHandler;
export const POST = graphqlHandler;
