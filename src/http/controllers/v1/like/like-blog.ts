import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  likeUnlikeBlogBodySchema,
  likeUnlikeBlogParamsSchema,
} from 'http/validations/like';
import { makeLikeBlogUseCase } from 'use-cases/factories/make-like-blog';

export async function likeBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { blogId } = likeUnlikeBlogParamsSchema.parse(request.params);
  const { userId } = likeUnlikeBlogBodySchema.parse(request.body);

  try {
    const likeBlogUseCase = makeLikeBlogUseCase();

    const { likesCount } = await likeBlogUseCase.execute({ blogId, userId });

    return reply.status(200).send({ likesCount });
  } catch (error) {
    app.log.error(error, 'Error while liking the blog.');
    throw error;
  }
}
