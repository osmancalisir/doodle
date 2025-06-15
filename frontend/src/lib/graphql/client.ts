// frontend/src/lib/graphql/client.ts

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            // eslint-disable-next-line no-unused-vars
            merge(existing = [], incoming) {
              return [...incoming];
            },
          },
        },
      },
    },
  }),
});
