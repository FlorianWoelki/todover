import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Store } from 'vuex';
import { apolloClient } from './apollo-client';
import queries from './graphql/queries';
import { Mutation, State } from './store';

let accessToken = '';

/**
 * Set the access token to the new specified parameter.
 *
 * @param {string} accessToken - The new access token.
 * @returns {void}
 */
export const setAccessToken = (token: string): void => {
  accessToken = token;
};

/**
 * Get the access token.
 *
 * @returns {string} - The access token.
 */
export const getAccessToken = (): string => {
  return accessToken;
};

/**
 * Try to refresh the access token based on the refresh token in the cookies.
 * This function will update the token with @see {@link setAccessToken} and executes
 * @see {@link Mutation.SET_LOADING} to disable the loading status.
 *
 * @param {Store} store - The Vuex store.
 * @returns {void}
 */
export const tryToRefreshAccessToken = async (store: Store<State>): Promise<void> => {
  const token = getAccessToken();

  if (!token) {
    const { accessToken } = await fetch(`${import.meta.env.VITE_BACKEND_API}/refresh_token`, {
      method: 'POST',
      credentials: 'include',
    }).then((res) => res.json());

    setAccessToken(accessToken);

    await initMe(store);
    store.commit(Mutation.SET_LOADING, false);
  } else {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (exp && Date.now() >= exp * 1000) {
        const { accessToken } = await fetch(`${import.meta.env.VITE_BACKEND_API}/refresh_token`, {
          method: 'POST',
          credentials: 'include',
        }).then((res) => res.json());

        setAccessToken(accessToken);
        store.commit(Mutation.SET_LOADING, false);
      }
    } catch (error) {
      console.log('refresh token expired', error);
    }
  }
};

/**
 * Initializes me and settings in the Vuex store.
 * This function prefetches the user, if the user is logged in.
 *
 * @param {Store} store - The Vuex store.
 * @returns {void}
 */
const initMe = async (store: Store<State>): Promise<void> => {
  provideApolloClient(apolloClient);
  await new Promise<void>((resolve) => {
    const { onResult } = useQuery(queries.me);
    onResult(({ data }) => {
      if (!data) {
        resolve();
      } else {
        store.commit(Mutation.SET_ME, { value: data.me });
        store.commit(Mutation.UPDATE_SETTINGS, data.me.settings);
        resolve();
      }
    });
  });
};
