import { app } from 'app';
import { FastifyReply, FastifyRequest } from 'fastify';

import { updateDeleteBlogParamsSchema } from 'http/validations/blog';
import { makeDeleteBlogUseCase_ } from 'use-cases/factories/make-delete-blog-use-case';

export async function deleteBlog(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { blogId } = updateDeleteBlogParamsSchema.parse(request.params);

  try {
    const deleteBlogUseCase = makeDeleteBlogUseCase_();

    await deleteBlogUseCase.execute({ userId, blogId });

    reply.code(204);
  } catch (error) {
    app.log.error(error, 'Error while deleting blog.');
    throw error;
  }
}
