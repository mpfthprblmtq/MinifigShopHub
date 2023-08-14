import { defineConfig, Plugin } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import handlebars from 'vite-plugin-handlebars';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    eslint(),
    viteTsconfigPaths(),
    svgrPlugin(),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }) as Plugin,
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build'
  },
  publicDir: 'public',
  define: {
    _global: ({}),
    global: {}
  }
});