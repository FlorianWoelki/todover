import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ts from 'rollup-plugin-typescript2';

export default <UserConfig>{
  plugins: [
    vue(),
    {
      apply: 'build',
      ...ts({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
    },
  ],
  esbuild: false,
  build: {
    lib: {
      entry: 'src/i18n.ts',
      name: 'i18n',
    },
    minify: false,
    rollupOptions: {
      external: ['vue', 'vue-i18n'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
};
