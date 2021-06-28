import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { Store } from 'vuex';
import { getAccessToken } from './accessToken';
import { State } from './store';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API as string,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken() ?? '';
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : '',
    },
  };
});

const cache = new InMemoryCache({ addTypename: false });

export const apolloClient = (store: Store<State>) =>
  new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });
