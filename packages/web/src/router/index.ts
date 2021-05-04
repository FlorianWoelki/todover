import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const history = createWebHistory();
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
  },
];

const router = createRouter({ history, routes });

export default router;
