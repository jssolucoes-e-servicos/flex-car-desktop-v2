import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: { index: 'electron.cjs' },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: 'src/preload.ts'
        }
      }
    }
  },
  renderer: {
    root: 'src/renderer',
    viteConfig: 'vite.config.ts',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
