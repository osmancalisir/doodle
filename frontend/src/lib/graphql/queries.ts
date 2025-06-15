// frontend/src/lib/graphql/queries.ts

import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($after: String, $limit: Int) {
    messages(after: $after, limit: $limit) {
      id
      message
      author
      createdAt
    }
  }
`;
