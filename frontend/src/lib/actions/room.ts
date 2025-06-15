// frontend/src/lib/actions/room.ts

"use server";

import { client } from "@/lib/graphql/client";
import { gql } from "@apollo/client";

const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!) {
    createRoom(name: $name) {
      id
    }
  }
`;

export async function createRoom(name: string) {
  const { data } = await client.mutate({
    mutation: CREATE_ROOM,
    variables: { name },
  });

  return { roomId: data.createRoom.id };
}
