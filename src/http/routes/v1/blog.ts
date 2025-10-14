import { FastifyInstance } from 'fastify';
import { createBlog } from 'http/controllers/v1/blog/create-blog';
import { getAllBlogs } from 'http/controllers/v1/blog/get-all-blogs';

import { authenticate } from 'http/middlewares/authenticate';
import { authorize } from 'http/middlewares/authorize';

export async function blogRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/', { onRequest: [authorize(['admin'])] }, createBlog);

  app.get('/', { onRequest: [authorize(['admin', 'user'])] }, getAllBlogs);
}
