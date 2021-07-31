import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAccessToken, tryToRefreshAccessToken } from '../accessToken';
import { store } from '../store';
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
  tryToRefreshAccessToken(store);

  if ((to.name === 'Login' || to.name === 'Register') && getAccessToken() !== '') {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
