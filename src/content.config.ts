import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const quizQuestion = z
	.object({
		question: z.string(),
		options: z.array(z.string()).min(2).max(6),
		correctIndex: z.number().int().min(0),
		explanation: z.string(),
	})
	.refine((q) => q.correctIndex < q.options.length, {
		message: 'correctIndex muss kleiner als die Anzahl der Optionen sein',
	});

const hacks = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/hacks' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		tags: z.array(z.string()),
		order: z.number().optional(),
		quiz: z.array(quizQuestion).optional(),
	}),
});

export const collections = { hacks };
