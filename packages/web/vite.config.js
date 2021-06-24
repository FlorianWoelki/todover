import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteComponents from 'vite-plugin-components';
import svgLoader from 'vite-svg-loader';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    vue(),
    viteComponents(),
    svgLoader(),
    vueI18n({ include: path.resolve(__dirname, '../i18n/locales/**') }),
  ],
  optimizeDeps: {
    include: ['@apollo/client/core', '@apollo/client/link/context'],
    exclude: ['@apollo/client'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    _APP_VERSION: JSON.stringify(pkg.version),
  },
});
