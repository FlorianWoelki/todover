import * as path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import ViteComponents from 'vite-plugin-components';
import svgLoader from 'vite-svg-loader';
import pkg from './package.json';

export default defineConfig({
  plugins: [Vue(), ViteComponents(), svgLoader()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    _APP_VERSION: JSON.stringify(pkg.version),
  },
});
