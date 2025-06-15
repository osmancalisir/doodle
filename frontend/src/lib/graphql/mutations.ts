// frontend/src/lib/graphql/mutations.ts

import { gql } from "@apollo/client";

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

export const DELETE_ROOM = gql`
  mutation DeleteRoom($roomId: ID!) {
    deleteRoom(roomId: $roomId)
  }
`;
