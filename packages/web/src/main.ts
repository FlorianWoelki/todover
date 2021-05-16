import { createApp } from 'vue';
import UI from '@todover/ui/src/index';
import { store } from './store';
import router from './router';
import App from './App.vue';
import './index.css';

createApp(App).use(UI).use(router).use(store).mount('#app');
