import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { getAccessToken } from './accessToken';

/**
 * httpLink create the connection to the GraphQL endpoint.
 */
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_API}/graphql`,
  credentials: 'include',
});

/**
 * Creates the authorization header.
 */
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken() ?? '';
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : '',
    },
  };
});

/**
 * Creates a in memory cache for GraphQL.
 * `addTypename` is set toe false, because we do not want to
 * generate `__typename` properties for the objects.
 */
const cache = new InMemoryCache({ addTypename: false });

/**
 * Export the apollo client with the http link and in memory cache.
 */
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
