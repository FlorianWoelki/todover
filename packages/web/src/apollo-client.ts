import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { Store } from 'vuex';
import { State } from './store';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API as string,
  credentials: 'include',
});

const cache = new InMemoryCache();

export const apolloClient = (store: Store<State>) =>
  new ApolloClient({
    link: httpLink,
    headers: {
      authorization: store.state.user.accessToken ? `bearer ${store.state.user.accessToken}` : '',
    },
    cache,
  });
