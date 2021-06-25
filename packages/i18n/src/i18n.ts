import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  globalInjection: true,
  messages,
});

const translate = (key: string): string => {
  if (!key) {
    return '';
  }

  return i18n.global.t(key);
};

export { translate, i18n };
