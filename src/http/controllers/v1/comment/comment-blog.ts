import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import {
  commentBlogBodySchema,
  commentBlogParamsSchema,
} from 'http/validations/comment';
import { makeCommentBlogUseCase } from 'use-cases/factories/make-comment-blog-use-case';

export async function commentBlog(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub;
  const { content } = commentBlogBodySchema.parse(request.body);
  const { blogId } = commentBlogParamsSchema.parse(request.params);

  try {
    const commentBlogUseCase = makeCommentBlogUseCase();

    const { comment } = await commentBlogUseCase.execute({
      userId,
      blogId,
      content,
    });

    return reply.status(201).send(comment);
  } catch (error) {
    app.log.error(error, 'Error adding a comment to a blog.');
    throw error;
  }
}
