import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import { getBlogsQuerySchema } from 'http/validations/blog';
import { makeGetAllBlogsUseCase } from 'use-cases/factories/make-get-all-blogs-use-case';

export async function getAllBlogs(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;
  const { limit, offset } = getBlogsQuerySchema.parse(request.query);

  try {
    const getAllBlogsUseCase = makeGetAllBlogsUseCase();

    const { total, blogs } = await getAllBlogsUseCase.execute({
      userId,
      limit,
      offset,
    });

    return reply.code(200).send({ limit, offset, total, blogs });
  } catch (error) {
    app.log.error(error, 'Error while fetching blogs.');
    throw error;
  }
}
