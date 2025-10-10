import { FastifyInstance, FastifyReply } from 'fastify';

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
}
