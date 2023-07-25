import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'esnext', //browsers can handle the latest ES features
  },
})
