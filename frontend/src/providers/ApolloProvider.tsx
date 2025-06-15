// frontend/src/providers/ApolloProvider.tsx

"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/graphql/client";
import { ReactNode } from "react";

export default function ApolloClientProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
