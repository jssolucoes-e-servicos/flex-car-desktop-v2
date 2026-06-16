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
    rollupOptions: {
      input: {
        main: 'src/renderer/index.html',
      },
    },
  },
});
