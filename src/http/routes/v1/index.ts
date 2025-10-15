import { FastifyInstance, FastifyReply } from 'fastify';

import { authRoutes } from './auth';
import { blogRoutes } from './blog';
import { commentRoutes } from './comment';
import { likeRoutes } from './like';
import { userRoutes } from './user';

export async function v1Routes(app: FastifyInstance) {
  app.get('/', (_, reply: FastifyReply) => {
    reply.code(200).send({
      message: '🚀 API is live.',
      status: 'ok',
      version: '1.0.0',
      docs: 'https://docs.blog-api.tutorial.com',
      timestamp: new Date().toISOString(),
    });
  });

  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
  app.register(blogRoutes, { prefix: '/blogs' });
  app.register(likeRoutes, { prefix: '/likes' });
  app.register(commentRoutes, { prefix: '/comments' });
}
