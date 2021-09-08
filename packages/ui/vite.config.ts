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
      entry: 'src/index.ts',
      name: 'ui',
    },
    minify: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
};
