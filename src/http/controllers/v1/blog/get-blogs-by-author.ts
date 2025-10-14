import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';

import {
  getBlogsByAuthorParamsSchema,
  getBlogsQuerySchema,
} from 'http/validations/blog';
import { makeGetBlogsByAuthorUseCase } from 'use-cases/factories/make-get-blogs-by-author-use-case';

export async function getBlogsByAuthor(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;
  const { authorId } = getBlogsByAuthorParamsSchema.parse(request.params);
  const { limit, offset } = getBlogsQuerySchema.parse(request.query);

  try {
    const getBlogsByAuthorUseCase = makeGetBlogsByAuthorUseCase();

    const { total, blogs } = await getBlogsByAuthorUseCase.execute({
      userId,
      authorId,
      limit,
      offset,
    });

    return reply.code(200).send({ limit, offset, total, blogs });
  } catch (error) {
    app.log.error(error, 'Error while fetching blogs by user.');
    throw error;
  }
}
