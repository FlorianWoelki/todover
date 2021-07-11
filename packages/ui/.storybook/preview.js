import { app } from '@storybook/vue3';
import { i18n } from '@todover/i18n/src/i18n';
import '../tailwind.css';

app.use(i18n);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
