import { createApp } from 'vue';
import UI from '@todover/ui/src/index';
import { i18n } from '@todover/i18n/src/i18n';
import { store } from './store';
import router from './router';
import App from './App.vue';
import './index.css';
import { tryToRefreshAccessToken } from './accessToken';

setInterval(() => {
  tryToRefreshAccessToken(store);
}, 1000 * 60 * 15);

createApp(App).use(i18n).use(UI).use(router).use(store).mount('#app');
