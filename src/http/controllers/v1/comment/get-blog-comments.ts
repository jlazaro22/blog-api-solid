import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getCommentsByBlogIdParamsSchema } from 'http/validations/comment';
import { makeGetBlogCommentsUseCase } from 'use-cases/factories/make-get-blog-comments';

export async function getBlogComments(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { blogId } = getCommentsByBlogIdParamsSchema.parse(request.params);

  try {
    const getBlogCommentsUseCase = makeGetBlogCommentsUseCase();

    const { comments } = await getBlogCommentsUseCase.execute({ blogId });

    return reply.status(200).send({ comments });
  } catch (error) {
    app.log.error(error, 'Error retrieving blog comments.');
    throw error;
  }
}
