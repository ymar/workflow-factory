import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The domain is not confirmed yet. Change this one value when it is.
const SITE = 'https://neeeon.nl';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  redirects: {
    '/methode/': '/rewind/',
    '/artikelen/': '/teardowns/',
    '/en/method/': '/rewind/',
    '/en/writing/': '/teardowns/',
  },
});
