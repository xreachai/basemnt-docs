import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    section: z.enum(['start', 'api', 'agents']).optional(),
    order: z.number().default(99),
    method: z.string().optional(),
    path: z.string().optional(),
  }),
});

export const collections = { docs };
