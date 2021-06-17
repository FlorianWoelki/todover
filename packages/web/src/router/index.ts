import jwtDecode, { JwtPayload } from 'jwt-decode';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAccessToken, setAccessToken } from '../accessToken';
import { Mutation, store } from '../store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const history = createWebHistory();
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
];

const router = createRouter({ history, routes });

router.beforeEach(async (to, _, next) => {
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

  if ((to.name === 'Login' || to.name === 'Register') && getAccessToken() !== '') {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
