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

  input MessageInput {
    message: String!
    author: String!
  }

  type Query {
    messages(after: String, limit: Int): [Message]
  }

  type Mutation {
    createMessage(input: MessageInput!): Message
  }
`;

const resolvers = {
  Query: {
    messages: async (_: any, { after, limit }: any) => {
      const url = new URL(`${process.env.BACKEND_URL}/api/v1/messages`);
      if (after) url.searchParams.append("after", after);
      if (limit) url.searchParams.append("limit", limit);

      const { data } = await axios.get(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
        },
      });
      return data;
    },
  },
  Mutation: {
    createMessage: async (_: any, { input }: any) => {
      const { data } = await axios.post(`${process.env.BACKEND_URL}/api/v1/messages`, input, {
        headers: {
          Authorization: `Bearer ${process.env.CHAT_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      return data;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

const graphqlHandler = async (req: NextRequest) => {
  return handler(req);
};

export const GET = graphqlHandler;
export const POST = graphqlHandler;
