import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { Store } from 'vuex';
import { State } from './store';

const httpLink = (store: Store<State>) =>
  createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API as string,
    credentials: 'include',
    headers: {
      authorization: localStorage.getItem('token') ? `bearer ${localStorage.getItem('token')}` : '',
    },
  });

const cache = new InMemoryCache();

export const apolloClient = (store: Store<State>) =>
  new ApolloClient({
    link: httpLink(store),
    cache,
  });
