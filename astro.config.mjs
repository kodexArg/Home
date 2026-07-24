import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://home.kodexarg.com',
  integrations: [svelte()],
  adapter: cloudflare({
    imageService: 'passthrough',
    session: false
  })
});
