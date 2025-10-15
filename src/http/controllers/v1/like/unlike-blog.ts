import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import {
  likeUnlikeBlogBodySchema,
  likeUnlikeBlogParamsSchema,
} from 'http/validations/like';
import { makeUnlikeBlogUseCase } from 'use-cases/factories/make-unlike-blog-use-case';

export async function unlikeBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { blogId } = likeUnlikeBlogParamsSchema.parse(request.params);
  const { userId } = likeUnlikeBlogBodySchema.parse(request.body);

  try {
    const unlikeBlogUseCase = makeUnlikeBlogUseCase();

    await unlikeBlogUseCase.execute({ blogId, userId });

    reply.code(204);
  } catch (error) {
    app.log.error(error, 'Error while unliking the blog.');
    throw error;
  }
}
