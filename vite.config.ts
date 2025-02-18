import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'api-proxy.js',
      fileName: 'main',
    },
    rollupOptions: {
      output: {
        globals: {
          'socket.io': 'socket.io',
          'socket.io-client': 'socket.io-client',
          'express': 'express',
          'body-parser': 'body-parser',
        }
      },
      external: ['socket.io', 'socket.io-client', 'express','body-parser'],
    },
  },
});
