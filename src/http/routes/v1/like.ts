import { FastifyInstance } from 'fastify';
import { likeBlog } from 'http/controllers/v1/like/like-blog';
import { unlikeBlog } from 'http/controllers/v1/like/unlike-blog';

import { authenticate } from 'http/middlewares/authenticate';
import { authorize } from 'http/middlewares/authorize';

export async function likeRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    likeBlog,
  );

  app.delete(
    '/blog/:blogId',
    { onRequest: [authorize(['admin', 'user'])] },
    unlikeBlog,
  );
}
