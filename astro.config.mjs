import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The domain is not confirmed yet. Change this one value when it is.
const SITE = 'https://workflowfactory.nl';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  redirects: {
    '/methode/': '/blueprint/',
    '/artikelen/': '/teardowns/',
    '/en/method/': '/blueprint/',
    '/en/writing/': '/teardowns/',
    '/journeys/': '/workflows/',
  },
});
