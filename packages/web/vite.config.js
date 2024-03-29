import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteComponents from 'unplugin-vue-components/vite';
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
    exclude: ['@todover/i18n', '@todover/ui'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['vue', 'vue-i18n'],
  },
  define: {
    _APP_VERSION: JSON.stringify(pkg.version),
  },
});
