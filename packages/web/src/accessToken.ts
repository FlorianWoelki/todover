import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Store } from 'vuex';
import { Mutation, State } from './store';

let accessToken = '';

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const getAccessToken = (): string => {
  return accessToken;
};

export const tryToRefreshAccessToken = async (store: Store<State>): Promise<void> => {
  const token = getAccessToken();

  if (!token) {
    // TODO: change to env variable
    const { accessToken } = await fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then((res) => res.json());

    setAccessToken(accessToken);
    store.commit(Mutation.SET_LOADING, false);
  } else {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (exp && Date.now() >= exp * 1000) {
        // TODO: change to env variable
        const { accessToken } = await fetch('http://localhost:4000/refresh_token', {
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
