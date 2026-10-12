import { defineConfig } from 'astro/config';
import { remarkCode, rehypeUnwrapCode } from './src/plugins/remark-code';

// https://astro.build/config
export default defineConfig({
  // docs.basemnt.ai is served from the root of the Pages project.
  site: 'https://docs.basemnt.ai',
  trailingSlash: 'ignore',
  markdown: {
    remarkPlugins: [remarkCode],
    rehypePlugins: [rehypeUnwrapCode],
  },
});
