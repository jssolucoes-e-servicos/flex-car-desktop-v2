import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'out/main',
      lib: {
        entry: resolve('electron/main.ts')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'out/preload',
      lib: {
        entry: resolve('electron/preload.ts')
      }
    }
  },
  renderer: {
    plugins: [react()],
    publicDir: resolve('src/renderer/public'),
    build: {
      outDir: 'out/renderer'
    },
    resolve: {
      alias: { '@': resolve('src/renderer') }
    }
  }
})
