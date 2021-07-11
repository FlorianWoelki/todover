import { createI18n } from 'vue-i18n';
import en from '../locales/en.json';
import de from '../locales/de.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  globalInjection: true,
  messages: {
    en,
    de,
  },
});

const translate = (key: string): string => {
  if (!key) {
    return '';
  }

  return i18n.global.t(key);
};

export { translate, i18n };
