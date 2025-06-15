// frontend/src/lib/graphql/typeDefs.ts

import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($roomId: ID!, $after: String, $limit: Int) {
    messages(roomId: $roomId, after: $after, limit: $limit) {
      id
      message
      author
      createdAt
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      id
      name
      createdAt
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: MessageInput!) {
    createMessage(input: $input) {
      id
      message
      author
      createdAt
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      id
      name
      createdAt
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($roomId: ID!) {
    deleteRoom(roomId: $roomId)
  }
`;

export const typeDefs = gql`
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
    deleteRoom(roomId: ID!): Boolean
  }
`;

export interface Message {
  id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
}

export interface MessageInput {
  message: string;
  author: string;
  roomId: string;
}

export interface RoomInput {
  name: string;
}

export interface MessagesData {
  messages: Message[];
}

export interface RoomsData {
  rooms: Room[];
}

export interface CreateMessageData {
  createMessage: Message;
}

export interface CreateRoomData {
  createRoom: Room;
}

export interface MessagesVariables {
  roomId: string;
  after?: string;
  limit?: number;
}

export interface CreateMessageVariables {
  input: MessageInput;
}

export interface CreateRoomVariables {
  input: RoomInput;
}
