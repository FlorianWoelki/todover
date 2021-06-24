import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import UI from '@todover/ui/src/index';
import { store } from './store';
import router from './router';
import App from './App.vue';
import './index.css';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  globalInjection: true,
  messages,
});

createApp(App).use(i18n).use(UI).use(router).use(store).mount('#app');
