import { FastifyInstance } from 'fastify';
import { commentBlog } from 'http/controllers/v1/comment/comment-blog';

import { authenticate } from 'http/middlewares/authenticate';
import { authorize } from 'http/middlewares/authorize';

export async function commentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    commentBlog,
  );
}
