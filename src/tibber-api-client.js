import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// NB: Only for local use, since env-variables will be included in final build
const tibberAccessToken = process.env.REACT_APP_TIBBER_ACCESS_TOKEN;

const httpLink = new HttpLink({
  uri: "https://api.tibber.com/v1-beta/gql",
  headers: {
    authorization: `Bearer ${tibberAccessToken}`,
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://api.tibber.com/v1-beta/gql/subscriptions",
    reconnect: true,
    connectionParams: {
      token: tibberAccessToken,
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const tibberClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
