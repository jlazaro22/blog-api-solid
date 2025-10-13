import z from 'zod';

export const createBlogBodySchema = z.object({
  title: z
    .string('Title is required.')
    .trim()
    .max(180, 'Title must be less than 180 characters long'),
  content: z.string('Content is required.'),
  status: z
    .enum(
      ['draft', 'published'],
      'Status must be either "draft" or "published"',
    )
    .optional()
    .default('draft'),
});
