import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://http.uncodigo.com',
  prefetch: {
    prefetchAll: true
  },
  session: {
    driver: 'fs-lite',
    options: {
      base: './.sessions'
    }
  }
});
