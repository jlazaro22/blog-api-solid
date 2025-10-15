import { FastifyInstance } from 'fastify';
import { createBlog } from 'http/controllers/v1/blog/create-blog';
import { deleteBlog } from 'http/controllers/v1/blog/delete-blog';
import { getAllBlogs } from 'http/controllers/v1/blog/get-all-blogs';
import { getBlogBySlug } from 'http/controllers/v1/blog/get-blog-by-slug';
import { getBlogsByAuthor } from 'http/controllers/v1/blog/get-blogs-by-author';
import { updateBlog } from 'http/controllers/v1/blog/update-blog';

import { authenticate } from 'http/middlewares/authenticate';
import { authorize } from 'http/middlewares/authorize';

export async function blogRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/', { onRequest: [authorize(['admin'])] }, createBlog);

  app.get('/', { onRequest: [authorize(['admin', 'user'])] }, getAllBlogs);

  app.get(
    '/user/:authorId',
    { onRequest: [authorize(['admin', 'user'])] },
    getBlogsByAuthor,
  );

  app.get(
    '/:slug',
    { onRequest: [authorize(['admin', 'user'])] },
    getBlogBySlug,
  );

  app.put('/:blogId', { onRequest: [authorize(['admin'])] }, updateBlog);

  app.delete('/:blogId', { onRequest: [authorize(['admin'])] }, deleteBlog);
}
